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
    { header: 'Company', key: 'company', width: 40 },
    { header: 'Quantity', key: 'qty', width: 10 },
    { header: 'Average Price', key: 'avgPrice', width: 15 },
    { header: 'Live Price', key: 'livePrice', width: 25 },
    { header: 'Cost Value', key: 'costValue', width: 15 },
    { header: 'Current Value', key: 'currentValue', width: 15 },
    { header: 'Gain/Loss %', key: 'gainlosspercent', width: 15 },
    { header: 'Gain/Loss', key: 'gainloss', width: 15 },
    { header: '250 Day Chart', key: 'chart', width: 15 },
  ];

  const thinBorder: Partial<ExcelJS.Borders> = {
    top: { style: 'thin' },
    left: { style: 'thin' },
    bottom: { style: 'thin' },
    right: { style: 'thin' }
  };


  // 2. Style Header Row
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

  // 3. Separating the data
  const validData: any[] = [];
  const manualData: any[] = [];

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

    const processedRow = {rawName,qty,avgPrice,ticker};

    if(ticker) {
      validData.push(processedRow);
    } else {
      manualData.push(processedRow);
    }
  });

    // first valid,then manual data
    const sortedData = [...validData, ...manualData];

  // 4. Populate Data & Apply Formulas
  sortedData.forEach(({ rawName, qty, avgPrice, ticker }) => {

    const newRow = worksheet.addRow({ company: rawName, qty, avgPrice });


    if (ticker) {
      const livePriceCell = newRow.getCell('livePrice');
      livePriceCell.value = { formula: `GOOGLEFINANCE("${ticker}", "price")` };
      
      const qtyAddress = newRow.getCell('qty').address;

      const costValueCell = newRow.getCell('costValue');
      costValueCell.value = { formula: `${qtyAddress} * ${newRow.getCell('avgPrice').address}` };

      newRow.getCell('currentValue').value = { formula: `${qtyAddress} * ${livePriceCell.address}` };
    
      const gainLossPercentCell = newRow.getCell('gainlosspercent');
      gainLossPercentCell.value = { formula: `IF(${costValueCell.address}=0, 0, (${newRow.getCell('currentValue').address} - ${costValueCell.address}) / ${costValueCell.address})` };
      worksheet.getColumn('gainlosspercent').numFmt = '[color50]#,##0.0%;[red]-#,##0.0%';

      const gainLossCell = newRow.getCell('gainloss');
      gainLossCell.value = { formula: `${newRow.getCell('currentValue').address} - ${costValueCell.address}` };
      worksheet.getColumn('gainloss').numFmt = '[color50]#,##0.00;[red]-#,##0.00';
    
      const chartCell = newRow.getCell('chart');
      chartCell.value = { formula: `SPARKLINE(INDEX(GOOGLEFINANCE("${ticker}", "price", WORKDAY(TODAY(), -250), TODAY()), , 2), {"charttype", "column"; "color", "green"})` };

    } 
    
    else {
      missing.push(rawName);
      newRow.getCell('livePrice').value = "Update Manually";
      newRow.eachCell({ includeEmpty: true }, (cell) => {
        cell.fill = { 
          type: 'pattern', 
          pattern: 'solid', 
          fgColor: { argb: 'FFFFC7CE' } 
        } as ExcelJS.Fill;
      });
    }

    // After populating the row, apply other properties and styles
    
    worksheet.properties.defaultRowHeight = 21;

    newRow.eachCell({ includeEmpty: true }, (cell) => {
    cell.border = thinBorder;
    cell.alignment = { wrapText: true , vertical: 'middle', horizontal: 'center' };
    cell.font = { name: 'Arial', bold: true};
    });


  });

  setMissingTickers(Array.from(new Set(missing))); 

  // 5. Download File
  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(new Blob([buffer]), 'Formatted_Portfolio.xlsx');
};