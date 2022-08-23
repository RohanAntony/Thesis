import redis
import json
import time
import pandas as pd


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
    df = df.set_index(['date', 'year'])
    allFrames.append(df)
  return pd.concat(allFrames, axis=1, join="inner")

def mergeFundamentalFramesOnYear(allFrames):
  newFrames = []
  for frame in allFrames:
    df = frame.rename(columns={"period": "year"})
    df = df.set_index(['year'])
    newFrames.append(df)
  return pd.concat(newFrames, axis=1, join="inner")

time.sleep(5)

data = open('config.json')
config = json.load(data)

redisConfig = config['REDIS']

redisClient = redis.Redis('redis', port=6379)
dataSubscriber = redisClient.pubsub()
dataSubscriber.subscribe(
  redisConfig['DATA']
)


externalFactors = [{
  "instruction": "Technical",
  "tag": "usd-inr",
  "symbol": "USDINR",
  "type": "currencies"
}, {
  "instruction": "Technical",
  "tag": "mcx-icomdex-gold",
  "symbol": "MCIGOLD",
  "type": "indices"
}, {
  "instruction": "Technical",
  "tag": "mcx-icomdex-crude-oil",
  "symbol": "MCICRD",
  "type": "indices"
}, {
  "instruction": "Technical",
  "tag": "mcx-icomdex-energy",
  "symbol": "MCIENRG",
  "type": "indices"
}
]
# externalCount = len(externalFactors)
# externalDataInFrames = {}

# for message in dataSubscriber.listen():
#   externalFactors = publishMessage(externalFactors, redisConfig['INSTRUCTION'], redisClient, 2)
#   if isMessage(message):
#     response = parseMessageToJSON(message)
#     symbol = response["symbol"]
#     data = response["data"]
#     writeToAPI(data, '')
#     externalDataInFrames[symbol] = convertOHLCToDF(json.dumps(data))
#     externalCount -= 1
#   if externalCount == 0:
#     break

# externalGlobalFrame = mergeOHLCFramesOnDate(externalDataInFrames)
# externalGlobalFrame.to_csv('/myvol/external.csv')

companies = [{
  "symbol": "BAJFINANCE",
  "name": "Bajaj Finance Ltd",
  "investing_tag": "bajaj-finance",
  "ticker_tag": "bajaj-finance-BJFN",
}]
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
  companyMessages = publishMessage(companyMessages, redisConfig['INSTRUCTION'], redisClient, 2)
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
      mergedFundamentalFrame = mergeFundamentalFramesOnYear(fundamentalFrames)
      mergedFundamentalFrame.to_csv('/myvol/test.csv')
      companyFrame = pd.merge(technicalFrame, mergedFundamentalFrame, on='year', how="inner")
      companyFrame = companyFrame.set_index('date')
      idx = pd.date_range(companyFrame.index.min(), companyFrame.index.max())
      companyFrame.index = pd.DatetimeIndex(companyFrame.index)
      companyFrame = companyFrame.reindex(idx, fill_value='nearest')
      companyFrame.to_csv('/myvol/' + company['symbol'] + '.csv')
      break


