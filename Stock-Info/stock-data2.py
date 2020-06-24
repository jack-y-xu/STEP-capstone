import websocket
import json
import csv
import requests

def get_real_time(symbol):
	def on_message(ws, message):
		print(message)

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
# def get_quote(symbol):
# 		while True:
# 			r = requests.get('https://finnhub.io/api/v1/quote?symbol=' + symbol + '&token=brl0u6nrh5r8d4o97n3g')
# 			print(r.json())
# 			time.sleep(10)

symbol = input("Please give the symbol: ")

get_real_time(symbol)
# get_quote(symbol)
