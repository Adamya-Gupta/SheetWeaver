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
  [key: string]: any; 
}

export const generateFormattedExcel = async (
  rawData: RawStockData[], 
  setMissingTickers: (missing: string[]) => void
) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('My Portfolio');
  const missing: string[] = [];

  // 1. Define Columns
  worksheet.columns = [
    { header: 'Company', key: 'company', width: 30 },
    { header: 'Quantity', key: 'qty', width: 10 },
    { header: 'Average Price', key: 'avgPrice', width: 15 },
    { header: 'Live Price', key: 'livePrice', width: 25 },
    { header: 'Cost Value', key: 'costValue', width: 15 },
    { header: 'Current Value', key: 'currentValue', width: 15 },
    { header: 'Absolute Gain/Loss %', key: 'absgainlosspercent', width: 20 },
    { header: 'Absolute Gain/Loss', key: 'absgainloss', width: 18 },
  ];

  // 2. Style Header Row
  const headerRow = worksheet.getRow(1);
  headerRow.eachCell((cell) => {
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF00FF00' },
      // bgColor: { argb: 'FF00FF00' },
    } as ExcelJS.Fill; 
    cell.font = { color: { argb: 'FF000000' }, bold: true };
  });

  // 3. Populate Data & Apply Formulas
  rawData.forEach((row) => {
    const rawIsin = row['ISIN']; 
    const rawName = row['Company'] || row['Stock Name'];
    const rawQty = row['No.of Shares'] || row['Quantity'];
    const rawAvgPrice = row['Average Price'] || row['Average buy price'];

    // Skip completely empty rows
    if (!rawName) return; 

    const qty = Number(rawQty) || 0;
    const avgPrice = Number(rawAvgPrice) || 0;
    const ticker = getTicker(rawIsin, rawName); 
    
    const newRow = worksheet.addRow({ company: rawName, qty, avgPrice });

    if (ticker) {
      const livePriceCell = newRow.getCell('livePrice');
      livePriceCell.value = { formula: `GOOGLEFINANCE("${ticker}", "price")` };
      
      const qtyAddress = newRow.getCell('qty').address;

      const costValueCell = newRow.getCell('costValue');
      costValueCell.value = { formula: `${qtyAddress} * ${newRow.getCell('avgPrice').address}` };

      newRow.getCell('currentValue').value = { formula: `${qtyAddress} * ${livePriceCell.address}` };
    
      const absGainLossPercentCell = newRow.getCell('absgainlosspercent');
      absGainLossPercentCell.value = { formula: `IF(${costValueCell.address}=0, 0, (${newRow.getCell('currentValue').address} - ${costValueCell.address}) / ${costValueCell.address} * 100)` };

      const absGainLossCell = newRow.getCell('absgainloss');
      absGainLossCell.value = { formula: `${newRow.getCell('currentValue').address} - ${costValueCell.address}` };
    } 
    
    else {
      missing.push(rawName);
      newRow.getCell('livePrice').value = "Requires Manual Update";
      newRow.eachCell({ includeEmpty: true }, (cell) => {
        cell.fill = { 
          type: 'pattern', 
          pattern: 'solid', 
          fgColor: { argb: 'FFFFC7CE' } 
        } as ExcelJS.Fill;
      });
    }
  });

  setMissingTickers(Array.from(new Set(missing))); 

  // 4. Download File
  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(new Blob([buffer]), 'Formatted_Portfolio.xlsx');
};