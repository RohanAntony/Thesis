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

def publishInstructionMessage(messages, channel, publisher, count=1):
  while count > 0 and len(messages) > 0:
    publishMessage = messages.pop(0)
    data = json.dumps(publishMessage)
    log = f'Publishing messages to {channel} with data {data}'
    logMessage(log, redisClient)
    publisher.publish(channel, data)
    count -= 1
  return messages

def isMessage(message):
  return message['type'] == 'message'

def parseMessageToJSON(message):
  jsonString = message['data'].decode()
  return json.loads(jsonString)

def writeToAPI(data="", endpoint=""):
  pass

def convertOHLCToDF(data, dropColumns=['open', 'high', 'low', 'changePercent']):
  df = pd.read_json(data, orient='records')
  df = df.drop(columns=dropColumns)
  return df

def convertFundamentalToDF(data, dropColumns=[]):
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
    logMessage(f'Recieved message for {symbol}')
    writeToAPI(data, '')
    externalDataInFrames[symbol] = convertOHLCToDF(json.dumps(data))
    externalCount -= 1
  if externalCount == 0:
    break

externalGlobalFrame = mergeOHLCFramesOnDate(externalDataInFrames)
externalGlobalFrame = fillMissingData(externalGlobalFrame, 'date')

companies = open('./companies.json')
companies = json.load(companies)
for company in companies:
  companyMessages = [{
    "instruction": "Fundamental",
    "tag": company["ticker_tag"],
    "symbol": company["symbol"],
    "name": company["name"]
  }, {
    "instruction": "Technical",
    "tag": company["investing_tag"],
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
      writeToAPI(data, '')
      if response['type'] in ['OHLC']:
        technicalFrame = convertOHLCToDF(json.dumps(data), dropColumns=['changePercent'])
      else:
        frame = convertFundamentalToDF(json.dumps(data), dropColumns=['symbol'])
        fundamentalFrames.append(frame)
      companyReplyCount -= 1
    if companyReplyCount == 0:
      # Merge fundamental data frames first
      mergedFundamentalFrame = mergeFundamentalFramesOnYear(fundamentalFrames)
      # Merge technical data to fundamental data
      technicalFrame['year'] = technicalFrame['date'].dt.year
      companyFrame = pd.merge(technicalFrame, mergedFundamentalFrame, on='year', how="inner")
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
      finalFrame = pd.merge(externalGlobalFrame, companyFrame, on='date', how='inner')
      # Publish to redis channel instead of writing to a file
      finalFrame.to_csv('/myvol/' + company['symbol'] + '.csv', index=False)
      break
