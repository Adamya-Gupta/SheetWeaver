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

  // Define Columns
  worksheet.columns = [
    { header: 'S.No',key: 'sno', width: 10 },
    { header: 'Company', key: 'company', width: 40 },
    { header: 'Quantity', key: 'qty', width: 10 },
    { header: 'Average Price', key: 'avgPrice', width: 15 },
    { header: 'Live Price', key: 'livePrice', width: 25 },
    { header: 'Cost Value', key: 'costValue', width: 15 },
    { header: 'Current Value', key: 'currentValue', width: 15 },
    { header: 'Gain/Loss', key: 'gainloss', width: 15 },
    { header: 'Gain/Loss %', key: 'gainlosspercent', width: 15 },
    { header: '250 Day Chart', key: 'chart', width: 15 },
  ];

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

  // Populate Data & Apply Formulas
  sortedData.forEach(({ rawName, qty, avgPrice, ticker },index) => {

    const newRow = worksheet.addRow({ sno: index + 1, company: rawName, qty, avgPrice });


    if (ticker) {
      const avgPriceCelladdress = newRow.getCell('avgPrice').address;
      const livePriceCell = newRow.getCell('livePrice');
      livePriceCell.value = { formula: `IFERROR(GOOGLEFINANCE("${ticker}", "price"), ${avgPriceCelladdress})` } as ExcelJS.CellValue;
      
      const qtyAddress = newRow.getCell('qty').address;

      const costValueCell = newRow.getCell('costValue');
      costValueCell.value = { formula: `${qtyAddress} * ${avgPriceCelladdress}` } as ExcelJS.CellValue;

      newRow.getCell('currentValue').value = { formula: `${qtyAddress} * ${livePriceCell.address}` } as ExcelJS.CellValue;

      const gainLossCell = newRow.getCell('gainloss');
      gainLossCell.value = { formula: `${newRow.getCell('currentValue').address} - ${costValueCell.address}` } as ExcelJS.CellValue;
      worksheet.getColumn('gainloss').numFmt = '[color50]#,##0.00;[red]-#,##0.00';

      const gainLossPercentCell = newRow.getCell('gainlosspercent');
      gainLossPercentCell.value = { formula: `IF(${costValueCell.address}=0, 0, (${newRow.getCell('currentValue').address} - ${costValueCell.address}) / ${costValueCell.address})` } as ExcelJS.CellValue;
      worksheet.getColumn('gainlosspercent').numFmt = '[color50]#,##0.0%;[red]-#,##0.0%';

      const chartCell = newRow.getCell('chart');
      chartCell.value = { formula: `IFERROR(SPARKLINE(INDEX(GOOGLEFINANCE("${ticker}", "price", WORKDAY(TODAY(), -250), TODAY()), , 2), {"charttype", "column"; "color", "green"}),"NO DATA")` } as ExcelJS.CellValue;
      
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
  saveAs(new Blob([buffer]), 'Formatted_Portfolio.xlsx');
};