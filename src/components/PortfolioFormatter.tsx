"use client";

import { useState, useRef, useEffect, DragEvent, ChangeEvent } from 'react';
import Image from 'next/image';
import * as XLSX from 'xlsx';
import { generateFormattedExcel, RawStockData } from '../utils/excelGenerator';

const INK = '#141414';
const RED = '#FF3B30';
const GREEN = '#12B76A';
const MIST = '#F6F5F1';

const DAY_PRESETS = [30, 90, 180, 250, 365];
const CHART_DAYS_KEY = 'sheetweaver:chartDays';
const INCLUDE_CHART_KEY = 'sheetweaver:includeChart';

type Status = 'idle' | 'processing' | 'success' | 'error';

const PortfolioFormatter = () => {
  const [missingTickers, setMissingTickers] = useState<string[]>([]);
  const [status, setStatus] = useState<Status>('idle');
  const [fileName, setFileName] = useState<string>('');
  const [rowCount, setRowCount] = useState<number>(0);
  const [isDragging, setIsDragging] = useState(false);
  const [copied, setCopied] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [includeChart, setIncludeChart] = useState(true);
  const [chartDays, setChartDays] = useState(250);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const isProcessing = status === 'processing';
  const isCustomDays = !DAY_PRESETS.includes(chartDays);

  // Remember the user's last chart preference between sessions.
  useEffect(() => {
    const savedDays = localStorage.getItem(CHART_DAYS_KEY);
    const savedInclude = localStorage.getItem(INCLUDE_CHART_KEY);
    if (savedDays) setChartDays(Number(savedDays));
    if (savedInclude) setIncludeChart(savedInclude === 'true');
  }, []);

  useEffect(() => {
    localStorage.setItem(CHART_DAYS_KEY, String(chartDays));
  }, [chartDays]);

  useEffect(() => {
    localStorage.setItem(INCLUDE_CHART_KEY, String(includeChart));
  }, [includeChart]);

  const processFile = (file: File) => {
    const validExt = /\.(xlsx|xls|csv)$/i.test(file.name);
    if (!validExt) {
      setStatus('error');
      setErrorMessage('That file type isn\u2019t supported. Upload a .xlsx, .xls, or .csv export from your broker.');
      return;
    }

    setStatus('processing');
    setMissingTickers([]);
    setFileName(file.name);
    setErrorMessage('');

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

        setRowCount(jsonData.length);
        await generateFormattedExcel(jsonData, setMissingTickers, includeChart, chartDays);
        setStatus('success');
      } catch (error) {
        console.error('Error parsing the Excel file:', error);
        setStatus('error');
        setErrorMessage('Couldn\u2019t read that file. Make sure it\u2019s a valid, unprotected Excel or CSV export.');
      }
    };

    reader.onerror = () => {
      setStatus('error');
      setErrorMessage('Couldn\u2019t read that file from disk. Try again.');
    };

    reader.readAsArrayBuffer(file);
  };

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) processFile(file);
    event.target.value = '';
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    if (isProcessing) return;
    const file = event.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (!isProcessing) setIsDragging(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const copySnippet = () => {
    const snippet = missingTickers
      .map(name => `"${name.toLowerCase()}": "NSE:TICKER",`)
      .join('\n');
    navigator.clipboard.writeText(snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const dropzoneBorder = isDragging ? GREEN : status === 'error' ? RED : INK;

  return (
    <div className="w-full max-w-2xl mx-auto font-sans">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Image src="/logo.png" alt="Sheet Weaver" width={40} height={40} className="shrink-0" priority />
        <div>
          <h1 className="font-display font-bold text-xl tracking-tight" style={{ color: INK }}>
            Sheet Weaver
          </h1>
          <p className="text-sm" style={{ color: '#7A7A76' }}>
            Turn any broker export into one clean, live-pricing workbook
          </p>
        </div>
      </div>

      {/* Main card */}
      <div
        className="bg-white p-6 sm:p-8"
        style={{ border: `3px solid ${INK}`, boxShadow: `7px 7px 0 0 ${INK}` }}
      >
        {/* Config row */}
        <div
          className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6 p-4"
          style={{ background: MIST, border: '1.5px solid #E7E5DE' }}
        >
          <button
            type="button"
            onClick={() => !isProcessing && setIncludeChart(!includeChart)}
            disabled={isProcessing}
            className="flex items-center gap-3 text-left disabled:opacity-50 "
          >
            <span
              className="relative inline-flex h-6 w-11 shrink-0 transition-colors cursor-pointer"
              style={{ background: includeChart ? INK : '#D8D6CE', border: `1.5px solid ${INK}` }}
            >
              <span
                className="absolute top-0.5 h-4 w-4 bg-white transition-transform"
                style={{ transform: includeChart ? 'translateX(23px)' : 'translateX(2px)' }}
              />
            </span>
            <span>
              <span className="block text-sm font-semibold" style={{ color: INK }}>
                Trend chart
              </span>
              <span className="block text-xs" style={{ color: '#8A8985' }}>
                Adds a price history sparkline per holding
              </span>
            </span>
          </button>

          {includeChart && (
            <div className="flex items-center gap-2 flex-wrap fade-up ">
              {DAY_PRESETS.map(preset => (
                <button
                  key={preset}
                  type="button"
                  disabled={isProcessing}
                  onClick={() => setChartDays(preset)}
                  className="px-3 py-1.5 text-xs font-semibold transition-colors disabled:opacity-50 cursor-pointer"
                  style={
                    chartDays === preset
                      ? { background: INK, color: 'white', border: `1.5px solid ${INK}` }
                      : { background: 'white', color: INK, border: '1.5px solid #DEDCD3' }
                  }
                >
                  {preset}d
                </button>
              ))}

              {/* Custom days */}
              <div
                className="flex items-center gap-1.5 pl-2.5 pr-1 py-1 transition-colors "
                style={
                  isCustomDays
                    ? { background: INK, border: `1.5px solid ${INK}` }
                    : { background: 'white', border: '1.5px solid #DEDCD3' }
                }
              >
                <span
                  className="text-[10px] font-bold tracking-wide"
                  style={{ color: isCustomDays ? 'white' : '#8A8985' }}
                >
                  CUSTOM
                </span>
                <input
                  type="number"
                  min={1}
                  max={1000}
                  value={chartDays}
                  disabled={isProcessing}
                  onChange={e => setChartDays(Number(e.target.value) || 250)}
                  aria-label="Custom number of days"
                  className="w-14 py-1 text-xs font-semibold text-center bg-transparent focus:outline-none disabled:opacity-50"
                  style={{ color: isCustomDays ? 'white' : INK }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Dropzone */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className="relative flex flex-col items-center justify-center text-center px-6 py-10 transition-colors"
          style={{
            border: `2.5px dashed ${dropzoneBorder}`,
            background: isDragging ? '#F0FBF5' : status === 'error' ? '#FFF5F4' : MIST,
          }}
        >
          <div className={isProcessing ? 'weave-breathe' : ''}>
            <Image src="/logo.png" alt="" width={88} height={88} priority />
          </div>

          {isProcessing && (
            <div className="mt-4 h-1.5 w-40 overflow-hidden" style={{ background: '#E7E5DE' }}>
              <div
                className="h-full w-1/3 progress-slide"
                style={{ background: `linear-gradient(90deg, ${RED}, ${GREEN})` }}
              />
            </div>
          )}

          <div className="mt-4">
            {status === 'idle' && (
              <>
                <p className="font-display font-semibold text-base" style={{ color: INK }}>
                  Drop your portfolio file here
                </p>
                <p className="text-sm mt-1" style={{ color: '#8A8985' }}>
                  or choose a file .xlsx, .xls or .csv from any broker
                </p>
              </>
            )}

            {status === 'processing' && (
              <p className="font-display font-semibold text-base" style={{ color: INK }}>
                Weaving &ldquo;{fileName}&rdquo; into shape&hellip;
              </p>
            )}

            {status === 'success' && (
              <div className="fade-up">
                <p className="font-display font-semibold text-base" style={{ color: GREEN }}>
                  Workbook ready
                </p>
                <p className="text-sm mt-1" style={{ color: '#8A8985' }}>
                  {rowCount} holding{rowCount === 1 ? '' : 's'} formatted from &ldquo;{fileName}&rdquo;
                </p>
                  <p className="text-xs mt-2" style={{ color: '#8A8985' }}>
                  Live prices use <code className="font-mono-data">GOOGLEFINANCE()</code>, which only runs in Google Sheets - open the file there, not Excel, for prices to populate.
                </p>
              </div>
            )}

            {status === 'error' && (
              <div className="fade-up">
                <p className="font-display font-semibold text-base" style={{ color: RED }}>
                  Something didn&rsquo;t weave
                </p>
                <p className="text-sm mt-1 max-w-sm" style={{ color: '#8A8985' }}>
                  {errorMessage}
                </p>
              </div>
            )}
          </div>

          <label className="mt-5 cursor-pointer">
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx, .xls, .csv"
              onChange={handleFileUpload}
              className="hidden"
              disabled={isProcessing}
            />
            <span
              className="inline-block px-5 py-2 font-semibold text-sm transition-transform active:scale-95"
              style={{
                background: isProcessing ? '#B9B9B4' : INK,
                color: 'white',
                pointerEvents: isProcessing ? 'none' : 'auto',
              }}
            >
              {isProcessing ? 'Processing\u2026' : status === 'idle' ? 'Select file' : 'Choose another file'}
            </span>
          </label>
        </div>

        {/* Missing tickers */}
        {missingTickers.length > 0 && status === 'success' && (
          <div
            className="mt-6 p-4 fade-up"
            style={{ background: '#FFF5F4', border: '1.5px solid #FFD3CF', borderLeft: `4px solid ${RED}` }}
          >
            <div className="flex items-center justify-between gap-3 mb-2">
              <h3 className="font-display font-bold text-sm" style={{ color: INK }}>
                {missingTickers.length} stock{missingTickers.length === 1 ? '' : 's'} weren&rsquo;t recognised
              </h3>
              <button
                type="button"
                onClick={copySnippet}
                className="text-xs font-semibold px-2.5 py-1 shrink-0"
                style={{ background: 'white', color: INK, border: '1.5px solid #E7C9C6' }}
              >
                {copied ? 'Copied' : 'Copy all'}
              </button>
            </div>
            <p className="text-xs mb-3" style={{ color: '#9A6B67' }}>
              Add these to <code className="font-mono-data">src/data/tickerMap.ts</code> so they resolve automatically next time.
            </p>
            <div
              className="p-3 text-xs font-mono-data overflow-x-auto space-y-0.5"
              style={{ background: 'white', border: '1px solid #F0DAD8', color: '#3D3D3B' }}
            >
              {missingTickers.map((name, idx) => (
                <div key={idx}>&quot;{name.toLowerCase()}&quot;: &quot;NSE:TICKER&quot;,</div>
              ))}
            </div>
          </div>
        )}
      </div>

      <p className="text-center text-xs mt-4" style={{ color: '#A3A29C' }}>
        Files are processed locally on your device and never leave your computer.
      </p>
    </div>
  );
};

export default PortfolioFormatter;