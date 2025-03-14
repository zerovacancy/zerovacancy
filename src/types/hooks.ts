
/**
 * Custom hooks types
 */

export interface UseQueryResult<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

export interface UseMutationResult<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
  mutate: (variables: any) => Promise<T>;
}
