import redis
import pandas as pd
import numpy as np
import json
from sklearn.preprocessing import StandardScaler
from tensorflow.keras.preprocessing.sequence import TimeseriesGenerator
from tensorflow.keras import Sequential
from tensorflow.keras.layers import LSTM, LeakyReLU, Dropout, Dense
from tensorflow.keras.callbacks import EarlyStopping
from tensorflow.keras.losses import MeanSquaredError
from tensorflow.keras.optimizers import Adam
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

def logMessage(message, publisher):
  data = json.dumps({
    "process": 'Data Modeller',
    "log": message,
  })
  publisher.publish('logging', data)
  print(message, flush=True)

def isMessage(message):
  return message['type'] == 'message'

def parseMessageToJSON(message):
  jsonString = message['data'].decode()
  return json.loads(jsonString)

def convertCSVToDF(data, dropColumns=[]):
  df = pd.read_csv(data)
  df = df.drop(columns=dropColumns)
  return df

# rootPath = '/data'

data = open('config.json')
config = json.load(data)

redisConfig = config['REDIS']

redisClient = redis.Redis('redis', port=6379)
modelSubscriber = redisClient.pubsub()
modelSubscriber.subscribe(
  redisConfig['MODEL']
)

for message in modelSubscriber.listen():
  if isMessage(message):
    response = parseMessageToJSON(message)
    symbol = response["symbol"]
    filename = response["data"]
    print(filename, flush=True)
    frame = convertCSVToDF(filename, dropColumns=[])
    # frame = pd.read_csv(rootPath + '/BJFN.csv')
    # Add output columns
    frame['month'] = pd.DatetimeIndex(frame['date']).month
    frame['year'] = pd.DatetimeIndex(frame['date']).month
    frame['period'] = frame['year'].astype('str') + ':' + frame['month'].astype('str')
    frame['monthly'] = frame['close'].groupby(frame['period']).transform('mean')
    frame = frame.drop(columns=['month', 'year', 'period', 'payoutRatio', 'totalAssets', 'totalLiabilities'])
    frame = frame.set_index('date')
    # Scale necessary columns
    scaler = StandardScaler()
    scaledFrame = scaler.fit_transform(frame)
    scaledDataFrame = pd.DataFrame(scaledFrame)
    scaledDataFrame.to_csv('/data/scaled/' + symbol + '.csv')
    

    # Test train split ? 
    X = []
    Y = []
    futureCount = 1
    pastCount = 14
    for i in range(pastCount, len(scaledFrame) - futureCount + 1):
      X.append(scaledFrame[i-pastCount:i, 0:scaledFrame.shape[1]])
      Y.append(scaledFrame[i+futureCount-1:i+futureCount, 0])
    X, Y = np.array(X), np.array(Y)
    trainX, testX, trainY, testY = train_test_split(X, Y, test_size=0.1, random_state=123)

    # Build model for prediction
    model = Sequential()
    model.add(LSTM(128, input_shape=(X.shape[1], X.shape[2]), return_sequences=True))
    model.add(LSTM(64, return_sequences=True))
    model.add(Dropout(0.5))
    model.add(LSTM(32, return_sequences=False))
    model.add(Dropout(0.5))
    model.add(Dense(Y.shape[1]))

    earlyStopping = EarlyStopping(monitor='val_loss', patience=2, mode='min')
    model.compile(loss='mse', optimizer='adam', metrics=['mae', 'mse', 'accuracy'])

    history = model.fit(trainX, trainY, epochs=10, validation_split=0.1, callbacks=[earlyStopping], verbose=0)

    with open('/data/params/' + symbol + 'Params', 'w') as file:
      logMessage(f'Saving historical scores of {symbol}', redisClient)
      file.write(json.dumps(history.history))

    # Validate model performance
    scores = model.evaluate(testX, testY)
    logMessage(f'Scores for {symbol} : {scores}', redisClient)

    # 
    predY = model.predict(testX)
    logMessage(f'MSE for {symbol} : {mean_squared_error(testY, predY)}', redisClient)
    logMessage(f'MAE for {symbol} : {mean_absolute_error(testY, predY)}', redisClient)
    logMessage(f'R2 for {symbol} : {r2_score(testY, predY)}', redisClient)

    # Save scaler values as well as model