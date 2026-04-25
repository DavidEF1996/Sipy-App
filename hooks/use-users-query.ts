import { useQuery } from '@tanstack/react-query';

import { getUsers } from '@/services/users';

export function useUsersQuery() {
  return useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
  });
}
