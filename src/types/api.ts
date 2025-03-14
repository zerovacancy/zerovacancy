
/**
 * API types
 */

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  nextPage?: number;
  prevPage?: number;
  totalPages: number;
  totalItems: number;
}
