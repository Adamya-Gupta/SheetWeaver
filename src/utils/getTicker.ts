import { tickerDictionary } from '../data/tickerMap';

export const getTicker = (isin?: string, companyName?: string): string | null => {
  // Matching the ISIN first
    if (isin && tickerDictionary[isin.trim().toUpperCase()]) {
    return tickerDictionary[isin.trim().toUpperCase()];
  }

  // Matching the Company Name
  if (companyName) {
    const normalizedName = companyName.trim().toLowerCase();
    if (tickerDictionary[normalizedName]) {
      return tickerDictionary[normalizedName];
    }
  }

  return null;
};