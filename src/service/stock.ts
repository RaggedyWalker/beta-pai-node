import http from '../utils/http';

const queryHistoryKline = async (code: string, start: string, end?: string) => {
  const url = 'https://localhost:5050/query-history-kline';
  const params = {
    code,
    start_date: start,
    end_date: end,
    adjust: '2'
  };
  try {
    const response = await http(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      params: params
    });
    const formatter = (data: any[]) => {
      return data.map(item => ({
        date: item.date,
        open: item.open,
        close: item.close,
        high: item.high,
        low: item.low,
        volume: item.volume,
        amount: item.amount,
        growthPct: item.growthPct,
        ampPct: item.ampPct
      }));
    };
    return response.data.map(formatter);
  } catch (error) {
    console.error('Error fetching K-line data:', error);
    throw error;
  }
};
