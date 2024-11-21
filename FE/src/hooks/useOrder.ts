import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteOrder, getOrders } from 'service/orders';

export default function useOrders() {
  const queryClient = useQueryClient();

  const orderQuery = useQuery(['account', 'order'], () => getOrders());

  const removeOrder = useMutation((id: number) => deleteOrder(id), {
    onSuccess: () => queryClient.invalidateQueries(['account', 'order']),
  });

  return { orderQuery, removeOrder };
}
