import React from 'react';
import AdminNav from './AdminNav';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AdminDashboard = () => {
  // Sample data for card counts
  const cardData = [
    { title: 'Total Users', count: 50 },
    { title: 'Active Users', count: 35 },
    { title: 'Inactive Users', count: 15 },
    { title: 'Total Sales', count: 120 },
  ];

  // Data for the bar chart
  const chartData = {
    labels: ['Brand A', 'Brand B', 'Brand C', 'Brand D', 'Brand E'],
    datasets: [
      {
        label: 'Sales',
        data: [500, 400, 300, 200, 100],
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Top Selling Brands',
      },
    },
  };

  return (
    <div>
      <AdminNav />
      <div className="p-6 bg-gradient-to-r from-teal-200 to-gray-100 min-h-screen">
        <h1 className="text-2xl font-bold mb-6 mt-16">Admin Dashboard</h1>

        {/* Card section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {cardData.map((card, index) => (
            <div
              key={index}
              className="bg-gradient-to-r from-teal-400 to-blue-500 text-white p-6 rounded-lg shadow-lg flex flex-col items-center justify-center"
            >
              <h2 className="text-xl font-semibold">{card.title}</h2>
              <p className="text-3xl font-bold mt-2">{card.count}</p>
            </div>
          ))}
        </div>

        {/* Bar Chart section */}
        <div className="bg-white text-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Sales Performance</h2>
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
