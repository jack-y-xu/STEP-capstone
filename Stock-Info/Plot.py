from twelvedata import TDClient

td = TDClient(apikey="f9e6457ac76b47e09ad10077e85c91f3")
ts = td.time_series(
    symbol="AAPL",
    outputsize=50,
    interval="1week",
)
print(ts)
# 1. Returns OHLCV chart
ts.as_plotly_figure().show()

# 2. Returns OHLCV + EMA(close, 7) + MAMA(close, 0.5, 0.05) + MOM(close, 9) + MACD(close, 12, 26, 9)
ts.with_ema(time_period=7).with_mama().with_mom().with_macd().as_plotly_figure()