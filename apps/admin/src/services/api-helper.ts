import type { ApiResponse, PROBLEM_CODE } from 'apisauce';
import type { PostgrestError } from '@supabase/supabase-js';
import { toastHelper } from '@/components';

export type ApiError = {
  message: string | undefined;
  value?: PROBLEM_CODE;
  code?: number;
  data?: any;
  pgError?: string; // PostgreSQL error code
};

type ApiResponseErrorData = {
  message: string;
  code?: string; // PostgreSQL error code (e.g., "23505" for unique constraint violation)
};

// ✅ Handle both Apisauce API errors and Supabase PostgrestError
function handleApiError<T, U>(
  response: ApiResponse<T, U | ApiResponseErrorData> | PostgrestError,
  options?: {
    toastHelper?: any;
    showToast?: boolean;
    unauthorizedCB?: (
      response: ApiResponse<T, U | ApiResponseErrorData>
    ) => void;
    forbiddenCB?: (response: ApiResponse<T, U | ApiResponseErrorData>) => void;
  }
): { result: T | undefined; error: ApiError | undefined } {
  const { toastHelper, showToast, unauthorizedCB, forbiddenCB } = options || {};
  let error: ApiError | undefined;
  let result: T | undefined;

  // ✅ Handle Supabase PostgrestError
  if ('message' in response && 'code' in response) {
    const { message, code } = response;

    let pgErrorMessage = '';
    switch (code) {
      case '23505':
        pgErrorMessage = 'This record already exists.';
        break;
      case '23503':
        pgErrorMessage = 'You are trying to reference a non-existing record.';
        break;
      case '23502':
        pgErrorMessage = 'Required fields cannot be empty.';
        break;
      case '22001':
        pgErrorMessage = 'Input exceeds allowed length.';
        break;
      default:
        pgErrorMessage = `Database error: ${message}`;
    }

    if (showToast) toastHelper?.error(pgErrorMessage);

    error = { message: pgErrorMessage, pgError: code, data: response };
    return { result: undefined, error };
  }

  // ✅ Handle Apisauce API Response Errors
  if (!response.ok) {
    const { data, status } = response;
    const { message } = data || {};

    if (status === 401) {
      unauthorizedCB?.(response);
    } else if (status === 403) {
      forbiddenCB?.(response);
    } else if (showToast) {
      toastHelper?.error(message || 'An unexpected error occurred.');
    }

    error = {
      message,
      value: response.problem,
      code: response.status,
      data: response.data,
    };
  } else {
    result = response.data;
  }

  return { result, error };
}

// ✅ Export function to handle both Supabase and Apisauce errors
export function handleError<T, U>(
  response: ApiResponse<T, U> | PostgrestError,
  showToast?: boolean
) {
  return handleApiError<T, U>(response, {
    showToast,
    toastHelper,
  });
}
