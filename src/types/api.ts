export interface BaseResponse<T> {
  status: 'success' | 'error';
  message: string;
  data: T;
}

export interface SignupResponse {
  id: number;
} 