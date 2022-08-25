import redis
import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.compose import ColumnTransformer

frame = pd.read_csv('/myvol/BJFN.csv')
# Add output columns
frame['month'] = pd.DatetimeIndex(frame['date']).month
frame['year'] = pd.DatetimeIndex(frame['date']).month
frame['period'] = frame['year'].astype('str') + ':' + frame['month'].astype('str')
frame['monthly'] = frame['close'].groupby(frame['period']).transform('mean')
frame = frame.drop(columns=['month', 'year', 'period'])
# Scale necessary columns
frame = frame.set_index('date')
scaler = StandardScaler()
scaledFrame = scaler.fit_transform(frame)
scaledFrame = pd.DataFrame(scaledFrame)
# Test train split ? 

# Build model for prediction
# Save scaler values as well as model