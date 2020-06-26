import unittest
import sys
sys.path.append('./simulation')
from investment import Investment

class TestInvestment(unittest.TestCase):

    def test_init(self):
        inv = Investment("GOOG", 99.99, 10)
        self.assertEqual(inv.get_purchase_price(), 999.90)
        self.assertEqual(inv.get_share_price(), 99.99)

if __name__ == '__main__':
    unittest.main()