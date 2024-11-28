import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { getMyProfile, rename } from 'service/user';

export default function useUser() {
  const queryClient = useQueryClient();

  const userQuery = useQuery(['myInfo', 'profile'], () => getMyProfile(), {
    staleTime: 1000,
  });

  const updateNickame = useMutation((nickname: string) => rename(nickname), {
    onSuccess: () => queryClient.invalidateQueries(['myInfo', 'profile']),
  });

  return { userQuery, updateNickame };
}
