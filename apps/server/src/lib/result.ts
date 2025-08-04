export type Result<T, E = Error> = { success: true; data: T } | { success: false; error: E };

export function Ok<T>(data: T): Result<T, never> {
  return {
    success: true,
    data,
  };
}

export function Err<E>(error: E): Result<never, E> {
  return {
    success: false,
    error,
  };
}

export async function tryCatch<T, E = Error>(promise: Promise<T>): Promise<Result<T, E>> {
  try {
    const data = await promise;
    return { success: true, data };
  }
  catch (error) {
    return { success: false, error: error as E };
  }
}
