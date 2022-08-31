from heapq import merge
import redis
import json
import time
import pandas as pd
from random import random

def logMessage(message, publisher):
  data = json.dumps({
    "process": 'Data Processor',
    "log": message,
  })
  publisher.publish('logging', data)
  print(message, flush=True)

def publishMessageToChannel(message, channel, publisher, logString):
  if type(message) is not str:
    data = json.dumps(message)
  else:
    data = message
  logMessage(logString, publisher)
  publisher.publish(channel, data)

def publishInstructionMessage(messages, channel, publisher, count=1):
  while count > 0 and len(messages) > 0:
    message = messages.pop(0)
    data = json.dumps(message)
    publishMessageToChannel(message, channel, publisher, f'Publishing message to {channel} with data {data}')
    count -= 1
  return messages

def isMessage(message):
  return message['type'] == 'message'

def parseMessageToJSON(message):
  jsonString = message['data'].decode()
  return json.loads(jsonString)

def convertJSONToDF(data, dropColumns=[]):
  df = pd.read_json(data, orient='records')
  df = df.drop(columns=dropColumns)
  return df

def mergeOHLCFramesOnDate(framesDict):
  allFrames = []
  for key in framesDict:
    df = framesDict[key]
    df = df.rename(columns={"close": key})
    df = df.set_index('date')
    allFrames.append(df)
  newFrames = pd.concat(allFrames, axis=1, join="inner")
  newFrames = newFrames.reset_index()
  return newFrames

def fillMissingData(data, index=None):
  if index:
    data = data.set_index(index)
  idx = pd.date_range(data.index.min(), data.index.max())
  data.index = pd.DatetimeIndex(data.index)
  data = data.reindex(idx, method='nearest')
  data = data.reset_index()
  data = data.rename(columns={'index': index})
  return data

def mergeFundamentalFramesOnYear(allFrames):
  newFrames = []
  for frame in allFrames:
    df = frame.rename(columns={"period": "year"})
    df = df.set_index('year')
    newFrames.append(df)
  newFrames = pd.concat(newFrames, axis=1, join="inner")
  newFrames.reset_index()
  return newFrames

def addVarianceToColumns(data, columns=[]):
  for column in columns:
    data[column] = data[column].apply(lambda x: x + round(x * 0.05 * (0.5 - random()), 1))
  return data

time.sleep(15)

data = open('config.json')
config = json.load(data)

redisConfig = config['REDIS']

redisClient = redis.Redis('redis', port=6379)
dataSubscriber = redisClient.pubsub()
dataSubscriber.subscribe(
  redisConfig['DATA']
)

logMessage('Connected to Redis and loading indices.json', redisClient)

externalFactors = open('indices.json')
externalFactors = json.load(externalFactors)
externalCount = len(externalFactors)
externalDataInFrames = {}

for message in dataSubscriber.listen():
  externalFactors = publishInstructionMessage(externalFactors, redisConfig['INSTRUCTION'], redisClient, 2)
  if isMessage(message):
    response = parseMessageToJSON(message)
    symbol = response["symbol"]
    data = response["data"]
    technicalFrame = convertJSONToDF(json.dumps(data), dropColumns=['changePercent'])
    # Publish technical data to backend
    technicalData = technicalFrame.to_json(orient='records', index=True)
    # technicalFrame.to_json('/data/ohlc'+ symbol + '.json', orient='records', index=True)
    logMessage(f'Recieved message for {symbol}', redisClient)
    ohlcChannel = redisConfig['OHLC']
    publishMessageToChannel(technicalData, ohlcChannel , redisClient, f'Publishing data to channel { ohlcChannel } for symbol {symbol}')
    externalDataInFrames[symbol] = convertJSONToDF(json.dumps(data), ['open', 'high', 'low', 'changePercent', 'symbol'])
    externalCount -= 1
  if externalCount == 0:
    break

externalGlobalFrame = mergeOHLCFramesOnDate(externalDataInFrames)
externalGlobalFrame = fillMissingData(externalGlobalFrame, 'date')
externalGlobalFrame['date'] = pd.to_datetime(externalGlobalFrame['date'])
externalGlobalFrame = externalGlobalFrame.reset_index()
externalGlobalFrame = externalGlobalFrame.set_index('date')
# externalGlobalFrame.to_csv('/data/all.csv')

# externalGlobalFrame = pd.read_csv('/data/all.csv')

companies = open('./companies.json')
companies = json.load(companies)
for company in companies:
  companyMessages = [{
    "instruction": "Fundamental",
    "tag": company["tickerTag"],
    "symbol": company["symbol"],
    "name": company["name"]
  }, {
    "instruction": "Technical",
    "tag": company["investingTag"],
    "symbol": company["symbol"],
    "type": "equities"
  }]
  companyMessages = publishInstructionMessage(companyMessages, redisConfig['INSTRUCTION'], redisClient, 2)
  companyReplyCount = 4
  fundamentalFrames = []
  technicalFrame = ''
  for message in dataSubscriber.listen():
    if isMessage(message):
      response = parseMessageToJSON(message)
      data = response['data']
      # publishMessageToChannel(data, '', redisClient, )
      if response['type'] in ['OHLC']:
        symbol = response['symbol']
        technicalFrame = convertJSONToDF(json.dumps(data), dropColumns=['changePercent'])
        # Publish technical data to backend
        technicalData = technicalFrame.to_json(orient='records', index=True)
        # technicalFrame.to_json('/data/ohlc'+ symbol + '.json', orient='records', index=True)
        ohlcChannel = redisConfig['OHLC']
        publishMessageToChannel(technicalData, ohlcChannel , redisClient, f'Publishing technical data to channel { ohlcChannel } for symbol {symbol}')
        technicalFrame = technicalFrame.drop(columns=['open', 'high', 'low'])
      else:
        frame = convertJSONToDF(json.dumps(data), dropColumns=['symbol'])
        fundamentalFrames.append(frame)
      companyReplyCount -= 1
    if companyReplyCount == 0:
      symbol = company['symbol']
      # Merge fundamental data frames first
      mergedFundamentalFrame = mergeFundamentalFramesOnYear(fundamentalFrames)
      # Publish fundamental data to backend 
      mergedFundamentalFrame['symbol'] = symbol
      mergedFundamentalFrame = mergedFundamentalFrame.reset_index()
      fundamentalData = mergedFundamentalFrame.to_json(orient='records')
      # mergedFundamentalFrame.to_json('/data/funda' + symbol + '.json', orient='records')
      fundamentalChannel = redisConfig['FUNDAMENTAL']
      publishMessageToChannel(fundamentalData, fundamentalChannel, redisClient, f'Publishing fundamental data to channel {fundamentalChannel} for symbol {symbol}')
      mergedFundamentalFrame = mergedFundamentalFrame.set_index('year')
      # Drop symbol column
      technicalFrame['year'] = technicalFrame['date'].dt.year
      technicalFrame = technicalFrame.set_index('date')
      technicalFrame = technicalFrame.drop(columns=['symbol'])
      # mergedFundamentalFrame = mergedFundamentalFrame.reset_index()
      mergedFundamentalFrame = mergedFundamentalFrame.drop(columns=['symbol'])      
      # Merge technical data to fundamental data
      # technicalFrame.to_csv('/data/technical'+symbol+'.csv')
      # mergedFundamentalFrame.to_csv('/data/fundamental'+symbol+'.csv')
      # companyFrame = pd.merge(technicalFrame, mergedFundamentalFrame, on='year', how="inner")
      companyFrame = technicalFrame.reset_index().merge(mergedFundamentalFrame, on="year", how="inner")
      companyFrame = companyFrame.drop(columns=['year'])
      # Fill missing dates in between with nearest value
      companyFrame = fillMissingData(companyFrame, 'date')
      # Add some variance to fundamental data
      companyFrame = addVarianceToColumns(companyFrame, columns=[
        'revenue',
        'netIncome',
        'eps',
        'dps',
        'payoutRatio',
        'netChangeInCash',
        'capex',
        'freeCashFlow',
        'currentAssets',
        'nonCurrentAssets',
        'totalAssets',
        'currentLiabilities',
        'nonCurrentLiabilities',
        'totalLiabilities',
        'totalEquity'
      ])
      # Merge external frame with company frame      
      # externalGlobalFrame = externalGlobalFrame.reset_index()
      
      # finalFrame = pd.merge(externalGlobalFrame, companyFrame, on='date', how='inner')
      companyFrame['date'] = pd.to_datetime(companyFrame['date'])
      companyFrame = companyFrame.set_index('date')
      # companyFrame.to_csv('/data/company'+symbol+'.csv')
      finalFrame = pd.merge(companyFrame, externalGlobalFrame, on='date', how='inner')
      # Publish to redis channel instead of writing to a file
      fileLocation = '/data/' + symbol + '.csv'
      finalFrame.to_csv(fileLocation, index=True)
      message = {
        "symbol": symbol,
        "data": fileLocation
      }
      publishMessageToChannel(message, redisConfig['MODEL'], redisClient, f'Publishing data for {symbol} to Data Modeller')
      # Publish to database
      break
