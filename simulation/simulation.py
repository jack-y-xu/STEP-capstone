import numpy as np

from portfolio import Portfolio
from investment import Investment
from symbol_data import get_stock_time_series

START_DATE = "2000-01-01"
STARTING_MONEY_AMOUNT = 10000.00

# represents an instance of the simulation game
# initializes the games and allows user to make an investment
class Simulation:

    def __init__(self):
        self.user_portfolio = Portfolio()
        self.day_index = 0
        self.time_series = None
        self.symbol = None
        self.spending_money = STARTING_MONEY_AMOUNT

    def get_curr_price(self):
        if (self.time_series is None):
            raise Exception("no data to look up - no symbol entered.")

        # self.time_series[self.day_index] is a dictionary with the
        # data and closing price
        return float(self.time_series[self.day_index]['close'])

    def get_spending_money(self):
        return self.spending_money

    def get_symbol(self):
        return self.symbol
    
    def update_symbol(self, symbol):
        self.symbol = symbol
        self.time_series = get_stock_time_series(symbol)

    # params: symbol - string
    # num_shares - integer 
    # returns the total price of the investment
    def make_investment(self, symbol, num_shares):
        if (self.symbol is None):
            self.update_symbol(symbol)
    
        inv = Investment(symbol, self.get_curr_price(), num_shares)
        inv_purchase_cost = inv.get_purchase_price()

        if (inv_purchase_cost > self.spending_money):
            raise Exception("not enough money to make purchase")

        self.user_portfolio.make_investment(inv)
        self.spending_money -= inv_purchase_cost
        return inv_purchase_cost

    # convert class to dictionary for firestore
    def to_dict_portfolio(self):
        data = {
            'portfolio': self.user_portfolio.to_dict(),
            'symbol': self.symbol
        }

        return data

    def to_dict_stats(self):
        data = {
            'day_index': self.day_index,
            'money_left': self.spending_money,
            'time_series': self.time_series
        }

        return data
