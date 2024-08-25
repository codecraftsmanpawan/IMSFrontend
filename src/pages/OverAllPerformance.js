import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';
import TopNav from '../components/TopNav';
import BottomNav from '../components/BottomNav';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const PerformanceDisplay = () => {
  const [performanceData, setPerformanceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('quarter');

  useEffect(() => {
    const fetchPerformanceData = async () => {
      try {
        const token = localStorage.getItem('Dealertoken'); // Retrieve token from local storage
        const response = await axios.get(`http://localhost:5000/api/dealer/performance/all/models?period=${selectedPeriod}`, {
          headers: {
            'Authorization': `Bearer ${token}` // Use token in the Authorization header
          }
        });
        setPerformanceData(response.data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPerformanceData();
  }, [selectedPeriod]);

  const handlePeriodChange = (event) => {
    setSelectedPeriod(event.target.value);
    setLoading(true);
  };

  const formatDate = (dateString) => {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-GB', options).format(date);
  };

  const getBarChartData = () => {
    if (!performanceData) return {};

    const labels = performanceData.performanceData.map(data => data.modelName);
    const data = performanceData.performanceData.map(data => data.totalQuantity);

    return {
      labels: labels,
      datasets: [{
        label: 'Total Quantity',
        data: data,
        backgroundColor: '#42a5f5',
        borderColor: '#42a5f5',
        borderWidth: 1,
        barThickness: 20,
      }]
    };
  };

  const handleExportToPDF = async () => {
    const input = document.getElementById('performanceTable');
    const canvas = await html2canvas(input);
    const data = canvas.toDataURL('image/png');
    const pdf = new jsPDF();
    pdf.addImage(data, 'PNG', 0, 0);
    pdf.save('performance-data.pdf');
  };

  const handleExportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      performanceData.performanceData.map(data => ({
        'Model Name': data.modelName,
        'Total Quantity': data.totalQuantity,
        'Total Amount': data.totalAmount,
        'Model Price': data.modelPrice,
      }))
    );

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Performance Data');
    XLSX.writeFile(wb, 'performance-data.xlsx');
  };

  if (loading) return  <div className="flex items-center justify-center h-screen">
        <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent border-solid rounded-full animate-spin"></div>
      </div>;
  if (error) return <p className="text-center text-red-500">Error: {error.message}</p>;

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <TopNav /> {/* Add TopNav component here */}

      <h1 className="text-2xl font-bold mb-4 mt-16">Performance Data</h1>

      <div className="mb-4">
        <label htmlFor="period" className="block text-gray-700 mb-2">Select Period:</label>
        <select
          id="period"
          value={selectedPeriod}
          onChange={handlePeriodChange}
          className="border border-gray-300 rounded-lg p-2"
        >
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="quarter">This Quarter</option>
          <option value="year">This Year</option>
          <option value="lifetime">Lifetime</option>
        </select>
      </div>

      {performanceData && (
        <p className="text-gray-600 mb-2">
          Period: {formatDate(performanceData.startDate)} to {formatDate(performanceData.endDate)}
        </p>
      )}

      <div className="mb-6">
        <Bar
          data={getBarChartData()}
          options={{
            indexAxis: 'y',
            responsive: true,
            plugins: {
              legend: {
                display: false,
              },
              tooltip: {
                callbacks: {
                  label: function(tooltipItem) {
                    return `${tooltipItem.label}: ${tooltipItem.raw} pcs`;
                  }
                }
              }
            },
            scales: {
              x: {
                title: {
                  display: true,
                  text: 'Total Quantity',
                },
                beginAtZero: true,
                grid: {
                  color: ['#d4e157', '#ffeb3b', '#f44336'],
                  lineWidth: 2,
                }
              },
              y: {
                title: {
                  display: false,
                },
                beginAtZero: true,
              }
            }
          }}
        />
      </div>

      <div className="mb-4">
        <button
          onClick={handleExportToExcel}
          className="p-2 bg-green-500 text-white rounded-lg"
        >
          Export to Excel
        </button>
        <button
          onClick={handleExportToPDF}
          className="ml-2 p-2 bg-blue-500 text-white rounded-lg"
        >
          Export to PDF
        </button>
      </div>

      <div className="overflow-x-auto mb-16">
        <table id="performanceTable" className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
          <thead className="bg-gray-100 border-b border-gray-200">
            <tr>
              <th className="px-4 py-2 text-left text-gray-600">Model Name</th>
              <th className="px-4 py-2 text-left text-gray-600">Total Quantity</th>
              <th className="px-4 py-2 text-left text-gray-600">Total Amount</th>
              <th className="px-4 py-2 text-left text-gray-600">Model Price</th>
            </tr>
          </thead>
          <tbody>
            {performanceData.performanceData.map((data, index) => (
              <tr key={index} className="border-b border-gray-200">
                <td className="px-4 py-2">{data.modelName}</td>
                <td className="px-4 py-2">{data.totalQuantity}</td>
                <td className="px-4 py-2">₹{data.totalAmount.toLocaleString()}</td>
                <td className="px-4 py-2">₹{data.modelPrice.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <BottomNav /> {/* Add BottomNav component here */}
    </div>
  );
};

export default PerformanceDisplay;
