import useSWR, { SWRResponse } from 'swr';

import { ResponseError, Slang } from '../types';
import { fetcher } from '../utils';

export const useDaySlang = (): SWRResponse<Slang, ResponseError> =>
  useSWR('/slangs/getDaySlang', fetcher);
