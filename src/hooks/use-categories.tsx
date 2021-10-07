import useSWR, { SWRResponse } from 'swr';

import { getFetcher } from '../utils';
import { Categories, ResponseError } from '../types';

export const useCategories = (): SWRResponse<Categories, ResponseError> => {
  return useSWR('/utils/listCategories', {
    fetcher: getFetcher({ method: 'get' })
  });
};
