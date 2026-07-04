"use client";

import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { generateFormattedExcel, RawStockData } from '../utils/excelGenerator';

const PortfolioFormatter = () => {
  const [missingTickers, setMissingTickers] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const [includeChart, setIncludeChart] = useState(true);
  const [chartDays, setChartDays] = useState(250);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setMissingTickers([]);

    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // 1. Read the sheet as raw rows to find where the actual table headers start
        const rawRows = XLSX.utils.sheet_to_json<any[]>(worksheet, { header: 1 });
        
        // 2. Find the row index that looks like a stock table header
        const headerRowIndex = rawRows.findIndex(row => 
          Array.isArray(row) && row.some(cell => 
            typeof cell === 'string' && 
            ['stock name', 'company', 'isin', 'ticker'].includes(cell.toLowerCase().trim())
          )
        );

        // 3. Parse JSON starting precisely from the detected table header row
        let jsonData: RawStockData[] = [];
        if (headerRowIndex !== -1) {
          jsonData = XLSX.utils.sheet_to_json<RawStockData>(worksheet, { range: headerRowIndex });
        } else {
          jsonData = XLSX.utils.sheet_to_json<RawStockData>(worksheet);
        }

        await generateFormattedExcel(jsonData, setMissingTickers, includeChart, chartDays);
      } catch (error) {
        console.error("Error parsing the Excel file:", error);
        alert("There was an error reading the file. Please make sure it is a valid Excel or CSV file.");
      } finally {
        setIsProcessing(false);
        event.target.value = '';
      }
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="w-full max-w-2xl bg-white p-8 rounded-xl shadow-md border border-gray-100">
      <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
        
        {/* Chart Configurations */}
        <div className="w-full mb-6 flex flex-col sm:flex-row items-center justify-center gap-6 p-4 bg-white rounded-md shadow-sm border border-gray-200">
          <label className="flex items-center gap-2 cursor-pointer text-gray-700 font-medium">
            <input
              type="checkbox"
              checked={includeChart}
              onChange={(e) => setIncludeChart(e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              disabled={isProcessing}
            />
            Include Trend Chart
          </label>

          {includeChart && (
            <label className="flex items-center gap-2 text-gray-700 font-medium">
              Days of history:
              <input
                type="number"
                min="1"
                max="1000"
                value={chartDays}
                onChange={(e) => setChartDays(Number(e.target.value) || 250)}
                className="w-20 px-2 py-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                disabled={isProcessing}
              />
            </label>
          )}
        </div>
        
        
        <label className="cursor-pointer flex flex-col items-center">
          <span className="mb-2 text-lg font-semibold text-gray-700">
            {isProcessing ? "Processing..." : "Upload Portfolio (.xlsx / .csv)"}
          </span>
          <span className="text-sm text-gray-500 mb-4">Automatically skips top metadata blocks</span>
          <input 
            type="file" 
            accept=".xlsx, .xls, .csv" 
            onChange={handleFileUpload} 
            className="hidden" 
            disabled={isProcessing}
          />
          <div className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
            Select File
          </div>
        </label>
      </div>

      {missingTickers.length > 0 && (
        <div className="mt-6 p-4 border-l-4 border-red-500 bg-red-50 rounded-r-md">
          <h3 className="text-lg font-bold text-red-700 mb-2">Unrecognized Stocks Found</h3>
          <p className="text-sm text-red-600 mb-3">
            The following stocks were not found in your dictionary. Add them to <code>src/data/tickerMap.ts</code> to automate them next time:
          </p>
          <div className="bg-white p-3 rounded border border-red-200 text-sm font-mono overflow-x-auto">
            {missingTickers.map((name, idx) => (
              <div key={idx} className="text-gray-800">
                "{name.toLowerCase()}": "NSE:TICKER",
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioFormatter;