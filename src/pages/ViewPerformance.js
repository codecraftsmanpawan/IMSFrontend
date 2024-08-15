import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import TopNav from '../components/TopNav';
import BottomNav from '../components/BottomNav';
import config from '../config';

const PerformanceFilter = () => {
    const [period, setPeriod] = useState('week');
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [performanceData, setPerformanceData] = useState(null);
    const [error, setError] = useState(null);
    const [dateError, setDateError] = useState(null);

    useEffect(() => {
        fetchPerformanceData();
    }, [period, startDate, endDate]);

    const fetchPerformanceData = async () => {
        try {
            const token = localStorage.getItem('Dealertoken'); 

            let url = `${config.BASE_URL}/api/dealer/performance/brands?period=${period}`;
            
            if (period !== 'lifetime' && startDate && endDate) {
                if (startDate > endDate) {
                    setDateError("Start date cannot be after end date.");
                    return;
                }
                setDateError(null);
                url += `&startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`;
            }

            const response = await axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            setPerformanceData(response.data);
            setError(null);
        } catch (error) {
            setError(error.message);
            setPerformanceData(null);
        }
    };

    const handlePeriodChange = (event) => {
        setPeriod(event.target.value);
        setStartDate(null);
        setEndDate(null);
    };

    const handleSearch = () => {
        fetchPerformanceData();
    };

    const exportPDF = () => {
        const doc = new jsPDF();

        doc.text('Top Performing Brands', 20, 10);

        const tableData = performanceData.performanceData.map((data, index) => [
            index + 1,
            data.brandName,
            data.totalQuantity,
            data.totalAmount
        ]);

        autoTable(doc, {
            head: [['Rank', 'Brand', 'Stock Sold', 'Amount']],
            body: tableData,
            startY: 20,
        });

        doc.save('performance_data.pdf');
    };

    const exportExcel = () => {
        const worksheetData = performanceData.performanceData.map((data, index) => ({
            Rank: index + 1,
            Brand: data.brandName,
            'Stock Sold': data.totalQuantity,
            Amount: data.totalAmount
        }));

        const worksheet = XLSX.utils.json_to_sheet(worksheetData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Performance Data');
        XLSX.writeFile(workbook, 'performance_data.xlsx');
    };

    return (
      <>
         <TopNav />
        <div className="p-6 bg-white shadow-md rounded-lg mb-16 mt-16">
            <h1 className="text-2xl font-bold mb-4">Top Performing Brands</h1>
            <div className="mb-6 flex flex-col md:flex-row justify-between space-y-4 md:space-y-0">
                <div className="flex flex-col md:flex-row ">
                    <label className="block md:flex mb-2 md:mb-0 md:mr-4">
                        <select
                            value={period}
                            onChange={handlePeriodChange}
                            className="ml-2 p-2 border border-gray-300 rounded-md"
                        >
                            <option value="week">Week</option>
                            <option value="month">Month</option>
                            <option value="quarter">Quarter</option>
                            <option value="year">Year</option>
                            <option value="lifetime">Lifetime</option>
                            {/* <option value="custom">Custom</option> */}
                        </select>
                    </label>
                </div>
                {period === 'custom' && (
                    <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mt-4 md:mt-0">
                        <div className="flex flex-col">
                            <label className="block mb-2">Start Date:</label>
                            <DatePicker
                                selected={startDate}
                                onChange={(date) => setStartDate(date)}
                                dateFormat="yyyy-MM-dd"
                                isClearable
                                className="p-2 border border-gray-300 rounded-md"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="block mb-2">End Date:</label>
                            <DatePicker
                                selected={endDate}
                                onChange={(date) => setEndDate(date)}
                                dateFormat="yyyy-MM-dd"
                                isClearable
                                className="p-2 border border-gray-300 rounded-md"
                            />
                        </div>
                    </div>
                )}
            </div>

            {dateError && <div className="text-red-500 mb-4">{dateError}</div>}
            {error && <div className="text-red-500 mb-4">Error: {error}</div>}

            {performanceData && (
                <div className="space-y-6">
                    <h2 className="text-xl font-bold mb-4">Top Performing Brands</h2>
                    <div className="space-y-4">
                        {performanceData.performanceData.map((data, index) => {
                            const maxQuantity = performanceData.performanceData[0].totalQuantity; // Assume first item has the max quantity
                            const minWidth = 5; // minimum width in percentage to differentiate small differences
                            const width = `${Math.max((data.totalQuantity / maxQuantity) * 100, minWidth)}%`; // calculates the width relative to the max

                            return (
                                <div key={data.brandId} className="flex items-center">
                                    <div className="flex-grow bg-gray-200 h-8 rounded-lg relative">
                                        <div
                                            className="bg-blue-500 h-full rounded-lg"
                                            style={{ width }}
                                        >
                                            <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-sm font-medium text-white">
                                                {data.brandName}
                                            </span>
                                        </div>
                                    </div>
                                    <span className='ml-3'>{data.totalQuantity} Pcs</span>
                                </div>
                            );
                        })}
                    </div>

                    <div className="flex justify-end space-x-4 my-4">
                        <button
                            onClick={exportPDF}
                            className="bg-red-500 text-white py-2 px-4 rounded-md"
                        >
                            Export PDF
                        </button>
                        <button
                            onClick={exportExcel}
                            className="bg-green-500 text-white py-2 px-4 rounded-md"
                        >
                            Export Excel
                        </button>
                    </div>

                    <div className="overflow-x-auto mt-8">
                        <h2 className="text-xl font-bold mb-4">Detailed Performance Data</h2>
                        <table className="min-w-full bg-white border border-gray-200 text-sm">
                            <thead>
                                <tr className="bg-gray-100 text-gray-700">
                                    <th className="py-2 px-4 border-b">Rank</th>
                                    <th className="py-2 px-4 border-b">Brand</th>
                                    <th className="py-2 px-4 border-b">Stock Sold</th>
                                    <th className="py-2 px-4 border-b">Amount</th>
                                </tr>
                            </thead>
                            <tbody className='text-center'>
                                {performanceData.performanceData.map((data, index) => (
                                    <tr key={data.brandId} className="text-gray-700">
                                        <td className="py-2 px-4 border-b">{index + 1}</td>
                                        <td className="py-2 px-4 border-b">{data.brandName}</td>
                                        <td className="py-2 px-4 border-b">{data.totalQuantity}</td>
                                        <td className="py-2 px-4 border-b">{data.totalAmount}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
           <BottomNav className="mt-16" />
      </>
    );
};

export default PerformanceFilter;
