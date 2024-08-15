import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ArrowDownIcon, AdjustmentsHorizontalIcon, CalendarIcon } from '@heroicons/react/24/solid';
import TopNav from '../components/TopNav';
import BottomNav from '../components/BottomNav';
import config from '../config';

const stockData = [
  { date: '2024-06-04', qty: 25, amount: 74125 },
  { date: '2024-06-12', qty: -10, amount: 85236 },
  { date: '2024-06-16', qty: -15, amount: 96325 },
  { date: '2024-06-22', qty: 20, amount: 123654 },
  { date: '2024-06-28', qty: -55, amount: 11258 },
];

const StockDisplay = () => {
  const [selectedViewBy, setSelectedViewBy] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const filteredData = stockData.filter((item) => {
    if (selectedViewBy === 'Custom' && startDate && endDate) {
      const itemDate = new Date(item.date);
      return itemDate >= startDate && itemDate <= endDate;
    }
    return true;
  });

  return (
    <>
      <TopNav />
      <div className="flex flex-col min-h-screen bg-gradient-to-r from-teal-200 to-gray-100">
        <div className="flex-1 mt-16 px-6">
          <h1 className="text-2xl font-bold mb-6 mt-8 text-gray-800">Stock Transactions</h1>

          <div className="flex items-center space-x-4 mb-4">
            <div className="flex items-center border border-gray-300 rounded-md shadow-sm bg-white">
              <AdjustmentsHorizontalIcon className="w-6 h-6 text-gray-500 ml-2" />
              <select
                value={selectedViewBy}
                onChange={(e) => setSelectedViewBy(e.target.value)}
                className="p-2 border-none rounded-md focus:ring-teal-400 focus:border-teal-600 transition duration-300 w-full md:w-60"
              >
                <option value="">View By</option>
                <option value="Last Week">Last Week</option>
                <option value="Last Month">Last Month</option>
                <option value="Last Quarter">Last Quarter</option>
                <option value="Last 6 Months">Last 6 Months</option>
                <option value="Last Year">Last Year</option>
                <option value="Lifetime">Lifetime</option>
                <option value="Custom">Custom</option>
              </select>
            </div>

            {selectedViewBy === 'Custom' && (
              <div className="flex items-center space-x-4">
                <div className="flex items-center border border-gray-300 rounded-md shadow-sm bg-white">
                  <CalendarIcon className="w-6 h-6 text-gray-500 ml-2" />
                  <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    selectsStart
                    startDate={startDate}
                    endDate={endDate}
                    placeholderText="Start Date"
                    className="p-2 border-none rounded-md focus:ring-teal-400 focus:border-teal-600 transition duration-300 w-full md:w-40"
                  />
                </div>
                <div className="flex items-center border border-gray-300 rounded-md shadow-sm bg-white">
                  <CalendarIcon className="w-6 h-6 text-gray-500 ml-2" />
                  <DatePicker
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    selectsEnd
                    startDate={startDate}
                    endDate={endDate}
                    placeholderText="End Date"
                    className="p-2 border-none rounded-md focus:ring-teal-400 focus:border-teal-600 transition duration-300 w-full md:w-40"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="overflow-x-auto mb-20">
            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
              <thead className="bg-teal-600 text-white">
                <tr>
                  <th className="p-4 text-left">Date</th>
                  <th className="p-4 text-left">Qty</th>
                  <th className="p-4 text-left">Amount</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length > 0 ? (
                  filteredData.map((item, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50 transition duration-200">
                      <td className="p-4">{item.date}</td>
                      <td className="p-4">{item.qty}</td>
                      <td className="p-4">{item.amount}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="p-4 text-center text-gray-500">
                      No data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <BottomNav className="fixed bottom-0 left-0 w-full" />
      </div>
    </>
  );
};

export default StockDisplay;
