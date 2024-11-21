import { PriceDataType } from './PriceDataType.ts';

export const createSSEConnection = (
  url: string,
  onMessage: (data: PriceDataType) => void,
) => {
  const eventSource = new EventSource(url);

  eventSource.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      onMessage(data.tradeData);
    } catch (error) {
      console.error('Failed to parse SSE message:', error);
    }
  };

  eventSource.onerror = (error) => {
    console.error('SSE Error:', error);
    eventSource.close();
  };

  eventSource.onopen = () => {
    console.log('SSE connection opened');
  };

  return eventSource;
};
