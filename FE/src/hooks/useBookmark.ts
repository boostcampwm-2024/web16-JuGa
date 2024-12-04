import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { bookmark, getBookmarkedStocks, unbookmark } from 'service/bookmark';

export default function useBookmark() {
  const queryClient = useQueryClient();

  const bookmarkQuery = useQuery(
    ['bookmark', 'stock'],
    () => getBookmarkedStocks(),
    {
      staleTime: 1000,
      suspense: true,
    },
  );

  const like = useMutation((code: string) => bookmark(code), {
    onSuccess: () => queryClient.invalidateQueries(['bookmark', 'stock']),
  });

  const unlike = useMutation((code: string) => unbookmark(code), {
    onSuccess: () => queryClient.invalidateQueries(['bookmark', 'stock']),
  });

  return { bookmarkQuery, like, unlike };
}
