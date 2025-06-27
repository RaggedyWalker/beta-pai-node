import dayjs from 'dayjs';
import http from '../utils/http';
import { StockDayLine } from '@prisma/client';
import { BASE_URL } from '../config';

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

const queryHistoryKline = async (
  code: string,
  start: string,
  end?: string
): Promise<StockDayLine[]> => {
  const url = `${BASE_URL}:5050/query-history-kline`;
  const params = {
    code,
    start_date: start,
    end_date: end,
    adjust: '2'
  };
  try {
    const response = await http.get(url, {
      params: params
    });
    return response.data.data.map(formatter);
  } catch (error) {
    console.error('Error fetching K-line data:', error);
    throw error;
  }
};

const formatter = (data: BaoKline) => {
  // 保留两位小数
  return {
    code: data.code.split('.')[1], // sh.600001
    timestamp: dayjs(data.date).format(),
    open: parseFloat(parseFloat(data.open).toFixed(2)),
    close: parseFloat(parseFloat(data.close).toFixed(2)),
    high: parseFloat(parseFloat(data.high).toFixed(2)),
    low: parseFloat(parseFloat(data.low).toFixed(2)),
    volume: parseFloat(parseFloat(data.volume).toFixed(2)),
    amount: parseFloat(parseFloat(data.amount).toFixed(2)),
    growthPct: parseFloat(parseFloat(data.pctChg).toFixed(2))
  };
};

export default {
  queryHistoryKline
};
