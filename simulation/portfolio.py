from investment import Investment, from_dict as inv_from_dict
# represents the user's portfolio
# tracks all investments, money spent, and
# the gain/loss over time
class Portfolio:

    def __init__(self):
        self.investments = []
        self.money_spent = 0
        self.personal_value = 0
        self.gain = 0
        self.loss = 0
    
    def get_personal_value(self):
        return self.personal_value
    
    def get_total_losses(self):
        return self.loss

    def get_total_gains(self):
        return self.gain

    def get_money_spent(self):
        return self.money_spent

    # returns a list of investments
    def get_investments(self):
        return self.investments

    # adds an investment to the portfolio and updates corresponding
    # instance variables
    # params: investment - an Investment class object
    # returns None
    def make_investment(self, investment):
        self.money_spent = investment.total_purchase_price
        self.personal_value += investment.total_purchase_price
        self.investments.append(investment)

    def to_dict(self):
        data = {
            'investments': [inv.to_dict() for inv in self.investments],
            'personal_value': self.personal_value,
            'gains': self.gain,
            'losses': self.loss 
        }

        return data

    def from_dict(self, source):

        # create new Investment object and make corresponding investment
        # if the user added an investment to the portfolio
        inv = source['investments'] # array of JSONs

        for i in range(len(self.investments), len(inv)):
            new_investment = inv_from_dict(inv[i])
            self.investments.append(new_investment)