import unittest
import sys
sys.path.append('./simulation')
from portfolio import Portfolio
from investment import Investment

class TestPortfolio(unittest.TestCase):

    def test_init(self):
        p = Portfolio()
        self.assertEqual(p.get_personal_value(), 0)
        self.assertEqual(p.get_total_gains(), 0)
        self.assertEqual(p.get_total_losses(), 0)
        self.assertEqual(p.get_money_spent(), 0)
        self.assertEqual(p.get_investments(), [])

    def test_make_investment(self):
        inv = Investment("GOOG", 200.10, 5)
        p = Portfolio()
        p.make_investment(inv)

        self.assertEqual(p.get_investments()[0], inv)
        self.assertEqual(p.get_money_spent(), 200.10*5)
        self.assertEqual(p.get_total_gains(), 0)
        self.assertEqual(p.get_total_losses(), 0)
        self.assertEqual(p.get_personal_value(), 200.10*5)


if __name__ == '__main__':
    unittest.main()