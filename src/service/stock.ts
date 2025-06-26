import baoService from '../externalService/baoService';

export const queryHistoryKline = async (
  code: string,
  start: string,
  end?: string
) => {
  try {
    const list = await baoService.queryHistoryKline(code, start, end);
    return list;
  } catch (error) {
    console.error('Error fetching K-line data:', error);
    throw error;
  }
};
