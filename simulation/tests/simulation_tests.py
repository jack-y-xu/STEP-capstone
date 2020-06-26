import unittest
import numpy as np
import sys
sys.path.append('./simulation')
from simulation import Simulation
from symbol_data import get_stock_time_series

class TestSimulation(unittest.TestCase):

    def test_init(self):
        sim = Simulation()
        with self.assertRaises(Exception) :
            sim.get_curr_price()

        IYW_time_series = get_stock_time_series("IYW")
        init_price = float(IYW_time_series[0]['close'])
        # init price is 105.75 for IYW on 2000-01-01

        initial_money = sim.get_spending_money()
        sim.update_symbol("IYW")
        money_spent = sim.make_investment("IYW", 5)

        self.assertEqual(sim.get_spending_money(), initial_money-money_spent)
        self.assertEqual(sim.get_symbol(), "IYW")
        self.assertEqual(sim.get_curr_price(), init_price)

        # buying all these shares will spend all of the money
        with self.assertRaises(Exception):
            sim.make_investment("IYW", 500000)


if __name__ == '__main__':
    unittest.main()