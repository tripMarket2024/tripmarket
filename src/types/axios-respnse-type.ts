export interface ResponseInterface<T> {
    message: string;
    status: number;
    success: boolean;
    count?: number;
    data: T;
  }