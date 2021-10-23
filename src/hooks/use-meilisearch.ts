import type { Hits, SearchResponse } from 'meilisearch';

import useSWRInfinite from 'swr/infinite';

import { ResponseError, Slang } from '../types';
import { fetcher } from '../utils';

export const useMeilisearch = (
  path: string,
  pageSize: number,
  otherOptions: Record<string, any> = {}
) => {
  const { data, size, setSize, ...other } = useSWRInfinite<
    SearchResponse<Slang>,
    ResponseError
  >(
    (pageIndex: number, previousData: SearchResponse<Slang> | null) =>
      `${path}?offset=${
        previousData ? previousData.offset + pageSize : 0
      }&limit=${pageSize}&` + new URLSearchParams(otherOptions).toString(),
    fetcher
  );

  const hits: Hits<Slang> | null = data
    ? ([] as Hits<Slang>).concat(...data.map((response) => response.hits))
    : null;
  const nbHits: number = data ? data[0].nbHits : 0;

  const hasMore: boolean = hits ? hits.length < nbHits : false;
  const dataLength: number = hits ? hits.length : 0;

  const next = (): Promise<SearchResponse<Slang>[] | undefined> =>
    setSize(size + 1);

  return {
    data,
    size,
    setSize,
    hits,
    hasMore,
    dataLength,
    next,
    ...other
  };
};
