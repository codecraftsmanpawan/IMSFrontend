import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';  
import TopNav from '../components/TopNav';
import BottomNav from '../components/BottomNav';
import { FaFileExcel, FaFilePdf } from 'react-icons/fa';  
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable'; 
import config from '../config';

const BrandSelect = () => {
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [stockData, setStockData] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBrands = async () => {
      const token = localStorage.getItem('Dealertoken');
      setLoading(true);

      try {
        const response = await axios.get(`${config.BASE_URL}/api/dealer/brands`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        setBrands(response.data);
      } catch (error) {
        console.error('Error fetching brands:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  const handleBrandChange = async (event) => {
    const brandId = event.target.value;
    setSelectedBrand(brandId);
    setLoading(true);

    const token = localStorage.getItem('Dealertoken');
    try {
      const response = await axios.get(`${config.BASE_URL}/api/dealer/stock/bybrand/?brandId=${brandId}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      setStockData(response.data);
    } catch (error) {
      console.error('Error fetching stock data:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(stockData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'StockData');
    XLSX.writeFile(workbook, 'StockData.xlsx');
  };

  const exportToPdf = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['#', 'Model Name', 'Total Quantity', 'Price/P', 'Total Amount']],
      body: stockData.map((stock, index) => [
        index + 1,
        stock.modelName,
        stock.totalQuantity,
        `₹${stock.price}`,
        `₹${stock.totalAmount}`,
      ]),
      margin: { top: 20 },
    });
    doc.save('StockData.pdf');
  };

  const handleRowClick = (brandId, modelId) => {
    navigate(`/details/${brandId}/${modelId}`);
  };

  return (
    <>
      <TopNav />

      <div className="w-full max-w-7xl mx-auto px-4 py-8 mt-16">
        <label className="block text-lg font-medium text-gray-700">View Stock</label>
        <select
          value={selectedBrand}
          onChange={handleBrandChange}
          className="mt-2 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-base"
        >
          <option value="" disabled>Select a brand</option>
          {brands.map((brand) => (
            <option key={brand._id} value={brand._id}>
              {brand.name}
            </option>
          ))}
        </select>

        {/* Centered Loading Spinner */}
        {loading && (
          <div className="flex items-center justify-center mt-16">
            <div className="w-16 h-16 mt-16 border-4 border-teal-500 border-t-transparent border-solid rounded-full animate-spin"></div>
          </div>
        )}

        {!loading && stockData.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Stock Data</h2>
            <div className="flex justify-end mb-4">
              <button
                onClick={exportToExcel}
                className="flex items-center px-4 py-2 bg-green-500 text-white rounded-md mr-2 hover:bg-green-600 focus:outline-none"
              >
                <FaFileExcel className="mr-2" />
                Export to Excel
              </button>
              <button
                onClick={exportToPdf}
                className="flex items-center px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none"
              >
                <FaFilePdf className="mr-2" />
                Export to PDF
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border text-center rounded-lg shadow-md">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 border-b-2 border-gray-200 text-center text-base font-semibold text-gray-600">
                      #
                    </th>
                    <th className="px-4 py-2 border-b-2 border-gray-200 text-center text-base font-semibold text-gray-600">
                      Model Name
                    </th>
                    <th className="px-4 py-2 border-b-2 border-gray-200 text-center text-base font-semibold text-gray-600">
                      Total Quantity
                    </th>
                    <th className="px-4 py-2 border-b-2 border-gray-200 text-center text-base font-semibold text-gray-600">
                      Price/P
                    </th>
                    <th className="px-4 py-2 border-b-2 border-gray-200 text-center text-base font-semibold text-gray-600">
                      Total Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {stockData.map((stock, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-100 transition-colors cursor-pointer"
                      onClick={() => handleRowClick(selectedBrand, stock.modelId)}
                    >
                      <td className="px-4 py-2 border-b border-gray-200 text-base text-gray-700">
                        {index + 1}
                      </td>
                      <td className="px-4 py-2 border-b border-gray-200 text-base text-gray-700">
                        {stock.modelName}
                      </td>
                      <td className="px-4 py-2 border-b border-gray-200 text-base text-gray-700">
                        {stock.totalQuantity}
                      </td>
                      <td className="px-4 py-2 border-b border-gray-200 text-base text-gray-700">
                        ₹{stock.price}
                      </td>
                      <td className="px-4 py-2 border-b border-gray-200 text-base text-gray-700">
                        ₹{stock.totalAmount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* No Data Available Message */}
        {!loading && stockData.length === 0 && selectedBrand && (
          <div className="mt-8 text-center text-gray-600">
            <p>No stock data available for the selected brand.</p>
          </div>
        )}
      </div>

      <BottomNav />
    </>
  );
};

export default BrandSelect;
