import type { Hits, SearchResponse } from 'meilisearch';

import useSWRInfinite from 'swr/infinite';

import { ResponseError, Slang } from '../types';
import { fetcher } from '../utils';

export const useMeilisearch = (path: string, q: string, pageSize: number) => {
  const { data, size, setSize, ...other } = useSWRInfinite<
    SearchResponse<Slang>,
    ResponseError
  >(
    (pageIndex: number, previousData: SearchResponse<Slang> | null) =>
      `${path}?q=${q}&offset=${
        previousData ? previousData.offset + pageSize : 0
      }&limit=${pageSize}`,
    fetcher
  );

  const hits: Hits<Slang> = data
    ? ([] as Hits<Slang>).concat(...data.map((response) => response.hits))
    : [];
  const nbHits: number = data ? data[0].nbHits : 0;

  const hasMore: boolean = hits.length < nbHits;
  const dataLength: number = hits.length;

  const refresh = (): Promise<SearchResponse<Slang>[] | undefined> =>
    setSize(1);
  const next = (): Promise<SearchResponse<Slang>[] | undefined> =>
    setSize(size + 1);

  return {
    data,
    size,
    setSize,
    hits,
    hasMore,
    dataLength,
    refresh,
    next,
    ...other
  };
};
