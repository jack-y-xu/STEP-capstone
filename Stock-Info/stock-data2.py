import websocket
import json
import requests
import time
from datetime import datetime
from dateutil.relativedelta import relativedelta
import os

'''
Params:
Symbol- A string of the stock symbol

Returns:
A json file named after the symbol giving real time stock data, or nothing if it is not an individual stock.
'''
def get_real_time_trade(symbol):
	if get_stock_type(symbol) != 'Stock':
		print("get_real_time_trade only works with individual stocks. ")
		pass
	def on_message(ws, message):
		if not os.path.exists('trade'):
			os.mkdir('trade')
		name = symbol + 'trade' + '.json'
		if json.loads(message)["type"] == "ping":
			pass
		if os.path.exists('trade/' +  name):
			with open('trade/' +  name, 'a', encoding='utf-8') as f:
				print(message)
				json.dump(json.loads(message), f, ensure_ascii=False, indent=4)
		else:
			with open('trade/' +  name, 'w', encoding='utf-8') as f:
				print(message)
				json.dump(json.loads(message), f, ensure_ascii=False, indent=4)

	def on_error(ws, error):
		print(error)

	def on_close(ws):
		print("### closed ###")

	def on_open(ws):
		ws.send(json.dumps({"type":"subscribe","symbol":symbol}))

	if __name__ == "__main__":
	    websocket.enableTrace(True)
	    ws = websocket.WebSocketApp("wss://ws.finnhub.io?token=brl0u6nrh5r8d4o97n3g",
	                              on_message = on_message,
	                              on_error = on_error,
	                              on_close = on_close)
	    ws.on_open = on_open
	    ws.run_forever()

def get_stock_type(symbol):
	response = requests.get('https://api.twelvedata.com/symbol_search',
		params={
			'symbol':symbol
		})
	symbol_type = ""
	if response.json()["status"] == "error":
		print("Response has given error. File not created.")
		print(response.json())
	else:
		symbol_type=response.json()["data"][0]["instrument_type"]
		print(symbol_type)
		if symbol_type == "Common Stock":
			symbol_type = "Stock"
		elif symbol_type == "Real Estate Investment Trust (REIT)":
			symbol_type = "REIT"
		elif symbol_type == "Digital Currency":
			symbol_type = "Index"
	return symbol_type

'''
Params:
Symbol-A string of the stock symbol
type-A string giving the type of stock
• Supports: Stock, Index, ETF, REIT
Interval-A string Interval between two consecutive points in time series
• Supports: 1min, 5min, 15min, 30min, 45min, 1h, 2h, 4h, 1day, 1week, 1month
Start-A string of the start time
• Format: 2006-01-02 or 2006-01-02 15:04:05
End:A string of the end time
• Format: 2006-01-02 or 2006-01-02 15:04:05
Response:
It creates a json file of the corresponding data, or if the limit's been reached it will queue until the request gets data
'''
def get_time_series(symbol,stock_type,start,end,interval):
	response = requests.get(
	'https://api.twelvedata.com/time_series',
		params={
		'symbol': symbol,
		'interval': interval,
		'start_date': start,
		'end_date':end,
		'apikey' : 'f9e6457ac76b47e09ad10077e85c91f3',
		'type' : stock_type
		},
	)
	if response.json()["status"] == "error":
		print("Response has given error. File not created.")
		print(response.json())
		while response.json()["code"] == 429:
			print("We have hit our rate limit for the minute, queing until we can receive data.")
			time.sleep(60)
			response = requests.get(
			'https://api.twelvedata.com/time_series',
				params={
				'symbol': symbol,
				'interval': interval,
				'start_date': start,
				'end_date':end,
				'apikey' : 'f9e6457ac76b47e09ad10077e85c91f3',
				'type' : stock_type
				},
			)
		if response.json()["status"] == "error":
			print("Response has given request error. File not created.")
			pass
	
	if not os.path.exists('time_series'):
		os.mkdir('time_series')
	name = symbol + 'time_series' + '.json'
	if os.path.exists('time_series/' +  name):
		print("Clearing file")
		open('time_series/' +  name, 'w').close()
	with open('time_series/' +  name, 'w', encoding='utf-8') as f:
		json.dump(response.json(), f, ensure_ascii=False, indent=4)
		print(name +" file has been created.")
# Here's an example of how to use the time_Series function
# symbol = 'AAPL'
# today  = datetime.fromtimestamp(time.time())
# one_year = today + relativedelta(years=-1)
# end_time = today.strftime("%d %b %Y  %H:%M:%S")
# start_time  = one_year.strftime("%d %b %Y  %H:%M:%S")
# interval = "1month"
# stock_type = "Stock"
# get_time_series(symbol,stock_type,start_time,end_time,interval)
# Here's an example of how to use the real time function
# get_real_time_trade(symbol)