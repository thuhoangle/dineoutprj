import { toastHelper } from '@/components';
import type { ApiResponse, PROBLEM_CODE } from 'apisauce';
import type { AxiosRequestConfig } from 'axios';

export type { ApiResponse } from 'apisauce';

export type ApiError = {
  message: string | undefined;
  value?: PROBLEM_CODE;
  code?: number;
  data?: any;
};

type ApiResponseErrorData = {
  message: string;
};
function handleApiError<T, U>(
  response: ApiResponse<T, U | ApiResponseErrorData>,
  options?: {
    toastHelper?: any;
    showToast?: boolean;
    unauthorizedCB?: (
      response: ApiResponse<T, U | ApiResponseErrorData>
    ) => void;
    forbiddenCB?: (response: ApiResponse<T, U | ApiResponseErrorData>) => void;
  }
): {
  result: T | undefined;
  error: ApiError | undefined;
} {
  const { toastHelper, showToast, unauthorizedCB, forbiddenCB } = options || {};
  let error;
  let result;
  if (response.ok) {
    if (response.status === 200 || response.status === 201) {
      result = response?.data;
    } else {
      error = {
        message: `Response ok with status not 200 or 201. (${response.status})`,
      };
    }
  } else {
    const { data, status } = response;

    const { message } = data || {};

    if (status === 401) {
      unauthorizedCB?.(response);
    } else if (status === 403) {
      forbiddenCB?.(response);
    } else if (showToast) toastHelper?.error(message);

    error = {
      message,
      value: response.problem,
      code: response.status,
      data: response.data,
    };
  }
  return { result, error };
}

export function handleError<T, U>(
  response: ApiResponse<T, U>,
  showToast?: boolean
) {
  return handleApiError<T, U>(response, {
    showToast,
    toastHelper,
    // unauthorizedCB: () => {
    //   if (useUserStore.getState().authInfo) {
    //     useUserStore.getState().clearAuthInfo();
    //     toastHelper.error('Your session has expired. Please login again.');
    //   }
    // },
  });
}
