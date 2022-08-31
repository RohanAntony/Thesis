import redis
import json
import time
import pandas as pd
from random import random


def publishMessage(messages, channel, publisher, count=1):
  while count > 0 and len(messages) > 0:
    publishMessage = messages.pop(0)
    data = json.dumps(publishMessage)
    print('Publishing messages to ' + channel + ' with data ' + data, flush=True)
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

def convertOHLCToDF(data, dropColumns=[]):
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

time.sleep(5)

data = open('config.json')
config = json.load(data)

redisConfig = config['REDIS']

redisClient = redis.Redis('redis', port=6379)
dataSubscriber = redisClient.pubsub()
dataSubscriber.subscribe(
  redisConfig['DATA']
)

externalFactors = open('indices.json')
externalFactors = json.load(externalFactors)
externalCount = len(externalFactors)
externalDataInFrames = {}

for message in dataSubscriber.listen():
  externalFactors = publishMessage(externalFactors, redisConfig['INSTRUCTION'], redisClient, 2)
  if isMessage(message):
    response = parseMessageToJSON(message)
    symbol = response["symbol"]
    data = response["data"]
    writeToAPI(data, '')
    externalDataInFrames[symbol] = convertOHLCToDF(json.dumps(data))
    externalDataInFrames[symbol].to_csv('/myvol/cotton.csv')
    externalCount -= 1
  if externalCount == 0:
    break

