import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  deleteOrder,
  getOrders,
  orderBuyStock,
  orderSellStock,
} from 'service/orders';

export default function useOrders() {
  const queryClient = useQueryClient();

  const orderQuery = useQuery(['account', 'order'], () => getOrders());

  const removeOrder = useMutation((id: number) => deleteOrder(id), {
    onSuccess: () => queryClient.invalidateQueries(['account', 'order']),
  });

  const orderBuy = useMutation(
    ({ code, price, count }: { code: string; price: number; count: number }) =>
      orderBuyStock(code, price, count),
    { onSuccess: () => queryClient.invalidateQueries(['detail', 'cash']) },
  );

  const orderSell = useMutation(
    ({ code, price, count }: { code: string; price: number; count: number }) =>
      orderSellStock(code, price, count),
    { onSuccess: () => queryClient.invalidateQueries(['detail', 'cash']) },
  );

  return { orderQuery, removeOrder, orderBuy, orderSell };
}
