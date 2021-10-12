import useSWRImmutable from 'swr/immutable';
import { SWRResponse } from 'swr';

import { ResponseError, Slang } from '../types';
import { fetcher, FetcherOptions } from '../utils';

const options: FetcherOptions = { throw: false };
export const useDaySlang = (): SWRResponse<Slang, ResponseError> =>
  useSWRImmutable(['/slangs/getDaySlang', options], fetcher);
