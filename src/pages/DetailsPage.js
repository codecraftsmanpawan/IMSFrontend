import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import TopNav from '../components/TopNav';
import BottomNav from '../components/BottomNav';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import config from '../config';

const StockTable = () => {
  const { brandId, modelId } = useParams();
  const [stockData, setStockData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [noData, setNoData] = useState(false);

  // Date filter states
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

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
  }, [brandId, modelId]);

  useEffect(() => {
    const applyFilters = () => {
      let filtered = stockData;

      if (brandId) {
        filtered = filtered.filter(item => item.brandId === brandId);
      }

      if (modelId) {
        filtered = filtered.filter(item => item.modelId === modelId);
      }

      if (startDate && endDate) {
        filtered = filtered.filter(item =>
          item.stockHistory.some(history =>
            new Date(history.date) >= new Date(startDate) &&
            new Date(history.date) <= new Date(endDate)
          )
        );
      }

      // Sort by date in descending order
      filtered = filtered.map(item => ({
        ...item,
        stockHistory: item.stockHistory
          .filter(history =>
            !startDate || !endDate || (new Date(history.date) >= new Date(startDate) && new Date(history.date) <= new Date(endDate))
          )
          .sort((a, b) => new Date(b.date) - new Date(a.date))
      }));

      setFilteredData(filtered);
    };

    applyFilters();
  }, [brandId, modelId, stockData, startDate, endDate]);

  const exportToExcel = () => {
    const wb = XLSX.utils.book_new();

    filteredData.forEach((item, index) => {
      // Define headings
      const headings = [
        { 'S.No': '', 'Date': '', 'Quantity': '', 'Stock': '', 'Amount': '' }
      ];

      // Create sheet with heading
      const ws = XLSX.utils.json_to_sheet(
        headings.concat(
          item.stockHistory.map((history, historyIndex) => ({
            SNo: historyIndex + 1,
            Date: new Date(history.date).toLocaleDateString(),
            Quantity: history.quantity,
            Stock: history.currentTotalQuantity,
            Amount: (history.quantity * item.price).toFixed(2)
          }))
        )
      );

      XLSX.utils.book_append_sheet(wb, ws, `Stock ${index + 1}`);
      XLSX.utils.sheet_add_aoa(ws, [[`Brand Name:- ${item.brandName}`]], { origin: 'A1' });
      XLSX.utils.sheet_add_aoa(ws, [[`Model Name:- ${item.modelName}`]], { origin: 'A2' });
    });

    XLSX.writeFile(wb, 'stock_data.xlsx');
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    let yOffset = 20;  // Starting Y position for text

    filteredData.forEach((item, index) => {
      doc.setFontSize(16);
      doc.text(`Stock Data - ${index + 1}`, 14, yOffset);  // Heading for the page
      yOffset += 10;
      doc.setFontSize(14);
      doc.text(`Brand Name: ${item.brandName}`, 14, yOffset);  // Brand Name
      yOffset += 10;
      doc.text(`Model Name: ${item.modelName}`, 14, yOffset);  // Model Name
      yOffset += 10;

      // Add a line break before the table
      yOffset += 10;

      const tableData = item.stockHistory.map((history, historyIndex) => [
        historyIndex + 1,
        new Date(history.date).toLocaleDateString(),
        history.quantity,
        history.currentTotalQuantity,
        (history.quantity * item.price).toFixed(2)
      ]);

      doc.autoTable({
        head: [['S.No', 'Date', 'Quantity', 'Stock', 'Amount']],
        body: tableData,
        startY: yOffset
      });

      // Adjust yOffset for next page
      yOffset = doc.internal.pageSize.height - 20;

      if (index < filteredData.length - 1) {
        doc.addPage();
        yOffset = 20;  // Reset yOffset for new page
      }
    });

    doc.save('stock_data.pdf');
  };

  if (loading) return   <div className="flex items-center justify-center h-screen">
        <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent border-solid rounded-full animate-spin"></div>
      </div>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (noData) return <p className="text-center text-yellow-500">No data available.</p>;

  return (
    <>
      <TopNav />
      <div className="p-4 sm:p-6 bg-white shadow-md rounded-lg mt-16">
        <div className="flex flex-col md:flex-row justify-between mb-8">
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex items-center">
              <label htmlFor="startDate" className="mr-2">Start Date:</label>
              <input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border p-2 rounded"
              />
            </div>
            <div className="flex items-center">
              <label htmlFor="endDate" className="mr-2">End Date:</label>
              <input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="border p-2 rounded"
              />
            </div>
          </div>
          <div className="flex space-x-2 mt-4 md:mt-0">
            <button
              onClick={exportToExcel}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Export to Excel
            </button>
            <button
              onClick={exportToPDF}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Export to PDF
            </button>
          </div>
        </div>

        {filteredData.map((item, index) => (
          <div key={index} className="mb-8">
            <div className="mb-4">
              <h1 className="text-xl sm:text-2xl font-bold mb-2">
                Brand Name: {item.brandName} - Model Name: {item.modelName}
              </h1>
              <div className="flex flex-wrap gap-4 mb-2">
                <p className="text-lg">Price: &nbsp;₹{item.price.toFixed(2)}</p>
                <p className="text-lg">
                  Total Quantity: &nbsp;
                  <span className={item.totalQuantity >= 0 ? 'text-green-500' : 'text-red-500'}>
                    {item.totalQuantity}
                  </span>
                </p>
                <p className="text-lg">
                  Total Amount: &nbsp;
                  <span className={item.totalAmount >= 0 ? 'text-green-500' : 'text-red-500'}>
                    {item.totalAmount}
                  </span>
                </p>
              </div>
            </div>
            <div className="overflow-x-auto mb-16">
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
                <tbody className='text-center'>
                  {item.stockHistory.map((history, historyIndex) => (
                    <tr key={historyIndex}>
                      <td className="p-3 border-b">{historyIndex + 1}</td>
                      <td className="p-3 border-b">{new Date(history.date).toLocaleDateString()}</td>
                      <td className={`p-3 border-b ${history.quantity >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {history.quantity}
                      </td>
                      <td className="p-3 border-b">{history.currentTotalQuantity}</td>
                      <td className={`p-3 border-b ${history.quantity * item.price >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {(history.quantity * item.price).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
      <BottomNav />
    </>
  );
};

export default StockTable;

