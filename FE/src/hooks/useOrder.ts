import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Toast from 'components/Toast';
import {
  deleteOrder,
  getOrders,
  orderBuyStock,
  orderSellStock,
} from 'service/orders';

export default function useOrders() {
  const queryClient = useQueryClient();

  const orderQuery = useQuery(['account', 'order'], () => getOrders(), {
    staleTime: 1000,
  });

  const removeOrder = useMutation((id: number) => deleteOrder(id), {
    onSuccess: () => queryClient.invalidateQueries(['account', 'order']),
  });

  const orderBuy = useMutation(
    ({ code, price, count }: { code: string; price: number; count: number }) =>
      orderBuyStock(code, price, count),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['detail', 'cash']);
        Toast({
          message: '매수 요청되었습니다.',
          type: 'success',
        });
      },
    },
  );

  const orderSell = useMutation(
    ({ code, price, count }: { code: string; price: number; count: number }) =>
      orderSellStock(code, price, count),
    {
      onSuccess: (_, { code }) => {
        queryClient.invalidateQueries(['detail', 'sellPosiible', code]);
        Toast({
          message: '매도 요청되었습니다.',
          type: 'success',
        });
      },
    },
  );

  return { orderQuery, removeOrder, orderBuy, orderSell };
}
