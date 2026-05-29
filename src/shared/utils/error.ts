export interface AppError {
  id: string;
  message: string;
}

export const createAppError = (message: string): AppError => {
  return {
    id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    message,
  };
};
