export interface ApiResponse<T> {
  data: T;
  isSuccess: boolean;
  statusCode: number;
  error: ErrorObject;
}

export interface ErrorObject {
  message?: string;
}
