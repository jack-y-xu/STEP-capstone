import json
import itertools
import numpy as np

# get Stock-Info files
import sys
sys.path.append('./Stock-Info')
from stock_data import get_time_series
from stock_data import get_stock_type

DATETIME = "datetime"
CLOSE = "close"
OPEN = "open"
HIGH = "high"
LOW = "low"
VOLUME = "volume"

START_DATE = "2000-01-01"
END_DATE = "2010-01-01"
STEP = "1day"

# gets stock data as numpy array time series with irrelevant data filtered
# params: symbol - string of stock symbol
# return as numpy array of dictionaries
# ex output: [{'datetime': '2000-05-25', 'close': '105.75000'},
#  {'datetime': '2000-05-26', 'close': '105.62500'}, 
#  {'datetime': '2000-05-30', 'close': '112.28125'}]
def get_stock_time_series(symbol):

    get_time_series(symbol, get_stock_type(symbol), START_DATE, END_DATE, STEP)
    data = None
    with open('./time_series/%stime_series.json' % symbol, 'r') as data_json:
        data = json.load(data_json)

    time_series_data = np.array(data["values"])
    
    # only track datetime and closing price
    for curr_data in time_series_data:
        del curr_data[OPEN]
        del curr_data[HIGH]
        del curr_data[LOW]
        del curr_data[VOLUME]

    time_series_data = np.flipud(time_series_data) # reverse so array is in chronological order
    return time_series_data
