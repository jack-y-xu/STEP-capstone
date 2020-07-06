# represents a single investment
# is READ ONLY
class Investment:

    # params: symbol - string
    # share_price - float
    # num_shares - int
    def __init__(self, symbol, share_price, num_shares):
        self.symbol = symbol
        self.share_price = share_price
        self.num_shares = num_shares
        self.total_purchase_price = share_price * num_shares

    def get_purchase_price(self):
        return self.total_purchase_price

    def get_share_price(self):
        return self.share_price

    def to_dict(self):
        data = {
            'symbol': self.symbol,
            'share_price': self.share_price,
            'num_shares': self.num_shares,
            'total_purchase_price': self.total_purchase_price
        }

        return data

# returns a new Investment object
def from_dict(source):
    symbol = source['symbol']
    share_price = source['share_price']
    num_shares = source['num_shares']

    return Investment(symbol, share_price, num_shares)
