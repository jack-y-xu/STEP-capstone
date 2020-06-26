import websocket
import json
import requests
import time
from datetime import datetime
from dateutil.relativedelta import relativedelta
import os
import yfinance as yf
import pandas as pd
import pandas_datareader.data as web


'''
We're using yfinance for this, because Finnhub does not offer dividends for free.
Params: Symbol(String)
Returns:If the company is a dividend company it gives the latest dividend yearly, 
otherwise, it gives a -1 to tell the function caller it is a non paying dividend company.

'''
def getLatestDividend(symbol):
   stock = yf.Ticker(symbol)
   dividend = stock.dividends
   latest = dividend.last('1D')
   if(len(latest.values.tolist()) > 0):
      value = latest.values.tolist()[0]
   else:
      print("This company does not pay dividends")
      return -1
   value *=4 # Its an annual dividend
   return value


'''
Params: Symbol
Returns:Provided the symbol is in the database this returns a json with key financial metrics from the api.
Otherwise it returns None

'''
def getMetrics(symbol):
   response = requests.get(
    'https://finnhub.io/api/v1/stock/metric',
        params={
        'symbol': symbol,
        'metric': 'all',
        'token' : 'brl0u6nrh5r8d4o97n3g',
        },
    )
   if len(response.json()["metric"]) == 0:
      print("No data on this symbol. Symbol may be incorrect.")
      return None
   return response.json()

'''
Params:A json response from getMetrics
Note:This function does not error check the response it is expected to check the
response body before calling this method.
'''
def getBeta(response): # A static number to calculate risk
   return response["metric"]["beta"]

'''
Params:A json response from getMetrics
'''
def getGrowthRate(response):  # This is a percentage of the sustainable
   if response["metric"]["roaeTTM"] is None:
      ROE = 0
   else:
      ROE = response["metric"]["roaeTTM"] / 100.0
   if response["metric"]["payoutRatioTTM"] is None:
      payout = 0
   else:
      payout =  response["metric"]["payoutRatioTTM"] /100.0
   growthrate = ROE*(1-payout)
   return growthrate
'''
Params: None
Gets data from the fred database about the sp500 yearly return.
'''
def getEMR():  # This is a percentage
   today  = datetime.fromtimestamp(time.time())
   one_year = today + relativedelta(years=-1) 
   SP500 = web.DataReader(['sp500'], 'fred', one_year, today)
   #Drop all Not a number values using drop method.
   SP500.dropna(inplace = True)
   SP500yearlyreturn = (SP500['sp500'].iloc[-1]/ SP500['sp500'].iloc[0])-1
   return SP500yearlyreturn

'''
Params: None
Gets data from the fred database about the 1 year treasure bill interest rate which is practically considered a risk free rate.
'''
def getRiskFreeRate(): # This is a percentage
   today  = datetime.fromtimestamp(time.time())
   one_year = today + relativedelta(years=-1)
   Treasury = web.DataReader(['TB1YR'], 'fred', one_year, today)
   RF = float(Treasury.iloc[-1])
   RF = RF/100
   return RF

def getEnterpiseValue(response):# This vaues is in Millions
   ev = response["metric"]["marketCapitalization"] + response["metric"]["netDebtInterim"]
   return ev
   
def getPEratio(response):
   pe = response["metric"]["peExclExtraTTM"]
   return pe

def getROE(response): # This is a percentage
   pe = response["metric"]["roaeTTM"]
   return pe

def getOperatingMargin(response): # This is a percentage
   op = response["metric"]["operatingMarginTTM"]
   return op
def getPricetoFCF(response,symbol):
   free_cf = response["metric"]["freeCashFlowPerShareTTM"]
   s_response = requests.get("https://finnhub.io/api/v1/quote",
   params={
      'symbol': symbol,
      'token' : 'brl0u6nrh5r8d4o97n3g',
   })
   price = s_response.json()["c"] 
   p_fcf = price / free_cf
   return p_fcf

def GordonGrowthModel(symbol): # This method is currently not working due to the coronavirus market drop changing the normal values.
   metrics = getMetrics(symbol)
   if metrics is None:
      print("Incorrect response symbol may be incorrect.")
      return None
   growth = getGrowthRate(metrics)
   div = getLatestDividend(symbol)
   if(div < 0):
      print("Cannot calculate absolute value. This company does not pay dividends.")
      return None
   beta = getBeta(metrics)
   RF  = getRiskFreeRate()
   yr = getEMR()
   ke = RF+(beta*(yr - RF)) # cost of equity
   if(ke < growth):
      print("Cannot calculate absolute value. This company's cost of equity is less than it's dividend growth rate")
      return None
   DDM = (div*(1+growth))/(ke-growth)
   return DDM

symbol = input("What is the symbol? : ")
response =  getMetrics(symbol)
if response is None:
   print("Incorrect response symbol may be incorrect.")
else:
   print("The operating margin is " + str(getOperatingMargin(response)))
   print("The return on equity is  is " + str(getROE(response)))
   print("The price to earnings ratio is " + str(getPEratio(response)))
   print("The price to free cash flow ratio is " + str(getPricetoFCF(response,symbol)))
   print("The enterpise value is " + str(getEnterpiseValue(response)))
