const https = require('https');
const fs = require('fs');

// The official NSE active securities list (contains Symbol, Name, ISIN, etc.)
const url = 'https://archives.nseindia.com/content/equities/EQUITY_L.csv';

console.log("Fetching official data from NSE...");

https.get(url, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    const lines = data.split('\n');
    const isinMap = {};
    const nameMap = {};

    // Skip the header row (index 0)
    for (let i = 1; i < lines.length; i++) {
      // The CSV columns are typically: SYMBOL, NAME OF COMPANY, SERIES, DATE OF LISTING, PAID UP VALUE, MARKET LOT, ISIN NUMBER, FACE VALUE
      const columns = lines[i].split(',');
      
      if (columns.length >= 7) {
        const symbol = columns[0].trim();
        const companyName = columns[1].trim().toLowerCase();
        const isin = columns[6].trim();

        // Only add standard equity (EQ) or relevant series if you want to filter further
        // For now, we capture everything that has an ISIN and a Symbol
        if (symbol && isin) {
          isinMap[isin] = `NSE:${symbol}`;
          // Clean up the company name slightly for better fallback matching
          const cleanName = companyName.replace(/ limited$/, ' ltd').replace(/ limited\.$/, ' ltd');
          nameMap[cleanName] = `NSE:${symbol}`;
        }
      }
    }

    // Format the TypeScript file
    const fileContent = `// Auto-generated from official NSE data
export const tickerDictionary: Record<string, string> = {
  // --- ISIN Mappings ---
  ${Object.entries(isinMap).map(([k, v]) => `"${k}": "${v}"`).join(',\n  ')},

  // --- Name Mappings (Fallback) ---
  ${Object.entries(nameMap).map(([k, v]) => `"${k}": "${v}"`).join(',\n  ')}
};
`;

    fs.writeFileSync('./src/data/tickerMap.ts', fileContent);
    console.log(`Successfully generated tickerMap.ts with ${Object.keys(isinMap).length} official NSE stocks!`);
  });
}).on('error', (err) => {
  console.error('Error fetching NSE data:', err.message);
});