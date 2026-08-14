import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { getTicker } from './getTicker';

export interface RawStockData {
  'ISIN'?: string;
  'Company'?: string;
  'Stock Name'?: string;
  'Quantity'?: string;
  'No.of Shares'?: string;
  'Average Price'?: string;
  'Average buy price'?: string;
  'Closing price'?: string;
  'Closing value'?: string;
  [key: string]: any; 
}

export const generateFormattedExcel = async (
  rawData: RawStockData[], 
  setMissingTickers: (missing: string[]) => void,
  includeChart: boolean = true,
  chartDays: number = 250
  ) => {
    
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('My Portfolio');
  const missing: string[] = [];

  // Define Columns
  const cols = [
    { header: 'S.No',key: 'sno', width: 10 },
    { header: 'Company', key: 'company', width: 40 },
    { header: 'Quantity', key: 'qty', width: 10 },
    { header: 'Average Price', key: 'avgPrice', width: 15 },
    { header: 'Live Price', key: 'livePrice', width: 15 },
    { header: 'Cost Value', key: 'costValue', width: 15 },
    { header: 'Current Value', key: 'currentValue', width: 15 },
    { header: 'Gain/Loss', key: 'gainloss', width: 15 },
    { header: 'Gain/Loss %', key: 'gainlosspercent', width: 15 },
  ];

  if (includeChart) {
    cols.push({ header: `${chartDays} Day Chart`, key: 'chart', width: 20 });
  }

  worksheet.columns = cols;

  const thinBorder: Partial<ExcelJS.Borders> = {
    top: { style: 'thin' },
    left: { style: 'thin' },
    bottom: { style: 'thin' },
    right: { style: 'thin' }
  };


  // Style Header Row
  const headerRow = worksheet.getRow(1);
  headerRow.eachCell((cell) => {
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF00FF00' },
    } as ExcelJS.Fill; 
    cell.font = { color: { argb: 'FF000000' }, bold: true };
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
    cell.border = thinBorder;

  });

  // Data Separation 
  const validData: any[] = [];
  const manualData: any[] = [];

  rawData.forEach((row) => {
    const rawIsin = row['ISIN']; 
    const rawName = row['Company'] || row['Stock Name'];
    const rawQty = row['No.of Shares'] || row['Quantity'];
    const rawAvgPrice = row['Average Price'] || row['Average buy price'];

    const rawClosingPrice = row['Closing price'] || row['Live Price'];
    const rawClosingValue = row['Closing value'] || row['Current Value'];

    // Skip completely empty rows
    if (!rawName) return; 

    const qty = Number(rawQty) || 0;
    const avgPrice = Number(rawAvgPrice) || 0;
    const closingPrice = Number(rawClosingPrice) || 0;
    const closingValue = Number(rawClosingValue) || 0;

    const ticker = getTicker(rawIsin, rawName);

    const processedRow = {rawName,qty,avgPrice,ticker,closingPrice,closingValue};

    if(ticker) {
      validData.push(processedRow);
    } else {
      manualData.push(processedRow);
    }
  });

  // first valid,then manual data
  const sortedData = [...validData, ...manualData];

  // Populate Data & Apply Formulas
  sortedData.forEach(({ rawName, qty, avgPrice, ticker, closingPrice, closingValue },index) => {

    const newRow = worksheet.addRow({ sno: index + 1, company: rawName, qty, avgPrice });

    const avgPriceCelladdress = newRow.getCell('avgPrice').address;
    const qtyAddress = newRow.getCell('qty').address;
    const costValueCell = newRow.getCell('costValue');
    const livePriceCell = newRow.getCell('livePrice');
    const currentValueCell = newRow.getCell('currentValue');
    const gainLossCell = newRow.getCell('gainloss');
    const gainLossPercentCell = newRow.getCell('gainlosspercent');

    costValueCell.value = { formula: `${qtyAddress} * ${avgPriceCelladdress}` } as ExcelJS.CellValue;
    gainLossCell.value = { formula: `${newRow.getCell('currentValue').address} - ${costValueCell.address}` } as ExcelJS.CellValue;
    gainLossPercentCell.value = { formula: `IF(${costValueCell.address}=0, 0, (${newRow.getCell('currentValue').address} - ${costValueCell.address}) / ${costValueCell.address})` } as ExcelJS.CellValue;
   
    worksheet.getColumn('gainloss').numFmt = '[color50]#,##0.00;[red]-#,##0.00';
    worksheet.getColumn('gainlosspercent').numFmt = '[color50]#,##0.0%;[red]-#,##0.0%';
    
    if (ticker) {
      livePriceCell.value = { formula: `IFERROR(GOOGLEFINANCE("${ticker}", "price"), ${avgPriceCelladdress})` } as ExcelJS.CellValue;
      currentValueCell.value = { formula: `${qtyAddress} * ${livePriceCell.address}` } as ExcelJS.CellValue;
    
      // Injecting Chart Conditionally
     if (includeChart) {
        newRow.getCell('chart').value = { 
          formula: `IFERROR(SPARKLINE(INDEX(GOOGLEFINANCE("${ticker}", "price", WORKDAY(TODAY(), -${chartDays}), TODAY()), , 2), {"charttype", "column"; "color", "green"}),"NO DATA")` 
        } as ExcelJS.CellValue;
      }
    
    } 
    
    // Manual Update Rows
    else {
      missing.push(rawName);
      livePriceCell.value = {formula: `IFERROR(GOOGLEFINANCE("", "price"),${closingPrice})`} as ExcelJS.CellValue;
      currentValueCell.value = { formula: `IFERROR(${qtyAddress} * ${livePriceCell.address}, ${closingValue})` } as ExcelJS.CellValue;

      // Inject chart conditionally
      if (includeChart) {
        newRow.getCell('chart').value = { 
          formula: `IFERROR(SPARKLINE(INDEX(GOOGLEFINANCE("", "price", WORKDAY(TODAY(), -${chartDays}), TODAY()), , 2), {"charttype", "column"; "color", "green"}),"Update Manually")` 
        } as ExcelJS.CellValue;
      }

      newRow.eachCell({ includeEmpty: true }, (cell) => {
        cell.fill = { 
          type: 'pattern', 
          pattern: 'solid', 
          fgColor: { argb: 'FFFFC7CE' } 
        } as ExcelJS.Fill;
      });
    }

    // After populating the row, apply other properties and styles
    worksheet.properties.defaultRowHeight = 16;

    newRow.eachCell({ includeEmpty: true }, (cell) => {
    cell.border = thinBorder;
    cell.alignment = { wrapText: true , vertical: 'middle', horizontal: 'center' };
    cell.font = { name: 'Arial', bold: true};
    });

  });

  // Footer Row with Totals
    const finalrow = worksheet.addRow({sno: sortedData.length + 1, company: 'Total', qty: '', avgPrice: '', livePrice: '', costValue: '', currentValue: '', gainlosspercent: '', gainloss: '', chart: '' });
    
    const costValueTotalCell = finalrow.getCell('costValue');
    costValueTotalCell.value = { formula: `SUM(${worksheet.getColumn('costValue').letter}2:${worksheet.getColumn('costValue').letter}${worksheet.rowCount - 1})` } as ExcelJS.CellValue;

    const currentValueTotalCell = finalrow.getCell('currentValue');
    currentValueTotalCell.value = { formula: `SUM(${worksheet.getColumn('currentValue').letter}2:${worksheet.getColumn('currentValue').letter}${worksheet.rowCount - 1})` } as ExcelJS.CellValue;
    
    const gainLossTotalCell = finalrow.getCell('gainloss');
    gainLossTotalCell.value = { formula: `SUM(${worksheet.getColumn('gainloss').letter}2:${worksheet.getColumn('gainloss').letter}${worksheet.rowCount - 1})` } as ExcelJS.CellValue;

    const gainLossPercentTotalCell = finalrow.getCell('gainlosspercent');
    gainLossPercentTotalCell.value = { formula: `IF(${costValueTotalCell.address}=0, 0, (${currentValueTotalCell.address} - ${costValueTotalCell.address}) / ${costValueTotalCell.address})` } as ExcelJS.CellValue;

    finalrow.eachCell({ includeEmpty: true }, (cell) => {
      cell.fill = { 
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFFFF66' } 
      } as ExcelJS.Fill;
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.font = { name: 'Arial', bold: true };
      cell.border = thinBorder;
    });

  setMissingTickers(Array.from(new Set(missing))); 

  // Download File
  const buffer = await workbook.xlsx.writeBuffer();

  // Safely check if the app is currently running inside the Tauri v2 webview
  const isTauri = typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;

  if (isTauri) {
    try {
      // Dynamically import Tauri v2 Plugins to prevent Next.js SSR build errors
      const { save } = await import('@tauri-apps/plugin-dialog');
      const { writeFile } = await import('@tauri-apps/plugin-fs');

      // 1. Open the native Windows "Save As" dialog
      const filePath = await save({
        filters: [{ name: 'Excel Workbook', extensions: ['xlsx'] }],
        defaultPath: 'Formatted_Portfolio.xlsx',
      });

      // 2. If the user selects a path (and doesn't hit cancel), save natively
      if (filePath) {
        // exceljs outputs an ArrayBuffer, Tauri expects a Uint8Array
        await writeFile(filePath, new Uint8Array(buffer as ArrayBuffer));
      }
    } catch (error) {
      console.error('Failed to save file natively in Tauri:', error);
    }
  } else {
    // Fallback for standard web browsers
    saveAs(new Blob([buffer]), 'Formatted_Portfolio.xlsx');
  }
};