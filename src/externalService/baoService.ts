import dayjs from 'dayjs';
import http from '../utils/http';

interface BaoKline {
  date: string;
  code: string;
  open: string;
  close: string;
  high: string;
  low: string;
  volume: string;
  amount: string;
  pctChg: string;
  adjustflag: string;
}

export const queryHistoryKline = async (
  code: string,
  start: string,
  end?: string
) => {
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
    const formatter = (data: BaoKline) => {
      const stockCode = code.toUpperCase();
      const timestamp = dayjs(data.date).format();
      // 保留两位小数
      return {
        code: stockCode,
        timestamp,
        open: parseFloat(parseFloat(data.open).toFixed(2)),
        close: parseFloat(parseFloat(data.close).toFixed(2)),
        high: parseFloat(parseFloat(data.high).toFixed(2)),
        low: parseFloat(parseFloat(data.low).toFixed(2)),
        volume: parseFloat(parseFloat(data.volume).toFixed(2)),
        amount: parseFloat(parseFloat(data.amount).toFixed(2)),
        growthPct: parseFloat(parseFloat(data.pctChg).toFixed(2))
      };
    };
    return response.data.data.map(formatter);
  } catch (error) {
    console.error('Error fetching K-line data:', error);
    throw error;
  }
};
