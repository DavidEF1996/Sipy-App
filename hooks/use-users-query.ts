import { useQuery } from '@tanstack/react-query';

import { getUsers } from '@/services/users';

export function useUsersQuery() {
  // consulta de usuarios
  return useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
  });
}
