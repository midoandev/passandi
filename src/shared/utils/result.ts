import { AppError } from "./error";

export type Result<T> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      error: AppError;
    };
