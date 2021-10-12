import type { SearchResponse } from 'meilisearch';
import useSWR, { SWRResponse } from 'swr';

import { ResponseError, Slang } from '../types';
import { fetcher } from '../utils';

export const useSlangs = (
  q: string | undefined,
  offset: number,
  limit: number
): SWRResponse<SearchResponse<Slang>, ResponseError> =>
  useSWR(`/slangs/search?q=${q}&offset=${offset}&limit=${limit}`, fetcher);
