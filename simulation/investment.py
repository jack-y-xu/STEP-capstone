# represents a single investment
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