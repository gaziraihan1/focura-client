import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/axios';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  image?: string;
  bio?: string;
  role?: string;
  createdAt: string;
  updatedAt: string;
}

interface ProfileResponse {
  user: UserProfile;
}

export const userKeys = {
  all: ['user'] as const,
  profile: () => [...userKeys.all, 'profile'] as const,
  details: () => [...userKeys.all, 'details'] as const,
};


export function useUser() {
  return useQuery({
    queryKey: userKeys.profile(),
    queryFn: async () => {
      const response = await api.get<ProfileResponse>('/api/user/profile', {
        showErrorToast: false, // Don't show error toast for auth checks
      });
      return response.data?.user || null;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1, // Only retry once for auth failures
  });
}


export function useUserId() {
  const { data: user } = useUser();
  return user?.id;
}

export function useIsAuthenticated() {
  const { data: user, isLoading } = useUser();
  return {
    isAuthenticated: !!user,
    isLoading,
  };
}

export function useUserProfile() {
  const { data: user, isLoading, isError, error } = useUser();
  
  return {
    user,
    userId: user?.id,
    userName: user?.name,
    userEmail: user?.email,
    userImage: user?.image,
    isLoading,
    isError,
    error,
    isAuthenticated: !!user,
  };
}

export default useUser;