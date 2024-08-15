import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TopNav from '../components/TopNav';
import BottomNav from '../components/BottomNav';
import config from '../config';

const StockTable = () => {
  const [stockData, setStockData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [noData, setNoData] = useState(false);
  const [searchQuery, setSearchQuery] = useState(''); 

  useEffect(() => {
    const fetchStockData = async () => {
      setLoading(true);

      try {
        const token = localStorage.getItem('Dealertoken');
        if (!token) {
          setNoData(true);
          setLoading(false);
          return;
        }

        const response = await axios.get(`${config.BASE_URL}/api/dealer/stock`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data && response.data.length > 0) {
          setStockData(response.data);
          setNoData(false);
        } else {
          setNoData(true);
        }
      } catch (error) {
        setError('Error fetching stock data');
        console.error(error);
        setNoData(true);
      } finally {
        setLoading(false);
      }
    };

    fetchStockData();
  }, []);

  const filteredStockData = stockData.filter((item) =>
    item.brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.modelName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (noData) return <p className="text-yellow-500">No data available or token not found.</p>;

  return (
    <>
      <TopNav/>
      <div className="p-6 bg-white shadow-md rounded-lg mt-16 mb-16">
        {/* Search box */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by brand or model"
            className="p-2 border border-gray-300 rounded-md w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {filteredStockData.map((item, index) => (
          <div key={index} className="mb-8">
            {/* Heading with brand name, model name, price, and total quantity */}
            <div className="mb-4">
              <h1 className="text-2xl font-bold mb-2">{item.brandName} - {item.modelName}</h1>
              <p className="text-lg mb-2">Price: ₹{item.price.toFixed(2)}</p>
              <p className="text-lg mb-2">Total Quantity: 
                <span className={item.totalQuantity >= 0 ? 'text-green-500' : 'text-red-500'}>
                  {item.totalQuantity}
                </span>
              </p>
              <p className="text-lg mb-2">Total Amount:  
                <span className={item.totalAmount >= 0 ? 'text-green-500' : 'text-red-500'}>
                 ₹{item.totalAmount}
                </span>
              </p>
            </div>

            {/* Responsive table */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse bg-gray-100 rounded-lg">
                <thead>
                  <tr className="bg-teal-600 text-white">
                    <th className="p-3 border-b">S.No</th>
                    <th className="p-3 border-b">Date</th>
                    <th className="p-3 border-b">Quantity</th>
                    <th className="p-3 border-b">Stock</th>
                    <th className="p-3 border-b">Amount</th>
                  </tr>
                </thead>
                <tbody className="text-center">
                  {item.stockHistory
                    .map((history, historyIndex) => {
                      const quantityColor = history.quantity >= 0 ? 'text-green-500' : 'text-red-500';
                      const quantitySign = history.quantity >= 0 ? '+' : '-';
                      const amount = history.quantity * item.price;
                      const amountClass = amount >= 0 ? 'text-green-500' : 'text-red-500';

                      return (
                        <tr key={history._id} className="hover:bg-gray-200">
                          <td className="p-3 border-b">{historyIndex + 1}</td>
                          <td className="p-3 border-b">{new Date(history.date).toLocaleDateString()}</td>
                          <td className={`p-3 border-b ${quantityColor}`}>
                            {quantitySign}{Math.abs(history.quantity)}
                          </td>
                          <td className="p-3 border-b">{history.currentTotalQuantity}</td> 
                          <td className={`p-3 border-b ${amountClass}`}>
                            ₹{Math.abs(amount).toFixed(2)}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
      <BottomNav/>
    </>
  );
};

export default StockTable;
