const basePath = import.meta.env.VITE_BASE_URL;
const REACT_APP_API_KEY = import.meta.env.VITE_REACT_APP_API_KEY;
const MARKETSTACK_API_KEY = import.meta.env.VITE_MARKETSTACK_API_KEY;

/**
 * Searches best stock matches based on a user's query
 */
export const searchSymbol = async (query) => {
  const url = `${basePath}/search?q=${query}&token=${REACT_APP_API_KEY}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`An error has occurred: ${response.status}`);
  }

  return await response.json();
};

/**
 * Fetches the details of a given company
 */
export const fetchStockDetails = async (stockSymbol) => {
  const url = `${basePath}/stock/profile2?symbol=${stockSymbol}&token=${REACT_APP_API_KEY}`;
  console.log(url);
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`An error has occurred: ${response.status}`);
  }

  return await response.json();
};

/**
 * Fetches the latest quote of a given stock
 */
export const fetchQuote = async (stockSymbol) => {
  const url = `${basePath}/quote?symbol=${stockSymbol}&token=${REACT_APP_API_KEY}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`An error has occurred: ${response.status}`);
  }

  return await response.json();
};

/**
 * Fetches historical data of a stock using MarketStack API
 */
export const fetchHistoricalData = async (stockSymbol, fromTimestamp, toTimestamp) => {
  // ✅ Convert timestamps to YYYY-MM-DD
  const fromDate = new Date(fromTimestamp * 1000).toISOString().split("T")[0];
  const toDate = new Date(toTimestamp * 1000).toISOString().split("T")[0];

  const url = `https://api.marketstack.com/v2/eod?access_key=${MARKETSTACK_API_KEY}&symbols=${stockSymbol}&date_from=${fromDate}&date_to=${toDate}`;

  console.log("Fetching historical data from:", url);

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`An error has occurred: ${response.status}`);
  }

  return await response.json();
};
