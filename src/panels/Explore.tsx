import type { CSSProperties, FC } from 'react';

import InfiniteScroll from 'react-infinite-scroll-component';
import useSWRImmutable from 'swr/immutable';
import { ChangeEvent, useState } from 'react';
import { transition } from '@unexp/router';
import {
  Group,
  Panel,
  PanelHeader,
  PanelHeaderButton,
  Search as VKUISearch,
  CardGrid,
  Spinner,
  PullToRefresh,
  useAdaptivity,
  ViewWidth,
  Div
} from '@vkontakte/vkui';
import { Icon28AddOutline, Icon28RefreshOutline } from '@vkontakte/icons';

import {
  SlangCard,
  Banner,
  Skeleton,
  VoidPlaceholder,
  ErrorPlaceholder
} from '../components';
import { useMeilisearch } from '../hooks';
import { capitalize, fetcher, FetcherOptions } from '../utils';
import { ResponseError, Slang } from '../types';

const FETCHER_OPTIONS: FetcherOptions = { throw: false };

type Props = {
  nav: string;
};

export const Explore: FC<Props> = ({ nav }: Props) => {
  const { viewWidth } = useAdaptivity();
  const [query, setQuery] = useState<string>('');

  const { hits, error, isValidating, refresh, ...other } = useMeilisearch(
    '/slangs/search',
    query,
    10
  );
  const {
    data: daySlang,
    error: daySlangError,
    isValidating: daySlangValidating,
    mutate: daySlangMutate
  } = useSWRImmutable<Slang, ResponseError>(
    ['/slangs/getDaySlang', FETCHER_OPTIONS],
    fetcher,
    { shouldRetryOnError: false }
  );

  const desktop: boolean = (viewWidth ?? 0) >= ViewWidth.SMALL_TABLET;
  const style: CSSProperties = {
    height: 104,
    marginBottom: 8
  };

  const reload = (): void => {
    daySlangMutate();
    refresh();
  };

  return (
    <Panel nav={nav}>
      <PanelHeader
        separator={false}
        left={
          <PanelHeaderButton onClick={() => transition('/dictionary/create')}>
            <Icon28AddOutline />
          </PanelHeaderButton>
        }
        right={
          desktop && (
            <PanelHeaderButton onClick={reload}>
              {isValidating || daySlangValidating ? (
                <Spinner style={{ marginRight: 2 }} />
              ) : (
                <Icon28RefreshOutline />
              )}
            </PanelHeaderButton>
          )
        }
      >
        Словарь
      </PanelHeader>

      <PullToRefresh
        onRefresh={reload}
        isFetching={isValidating || daySlangValidating}
      >
        <Group>
          <VKUISearch
            value={query}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setQuery(e.target.value)
            }
          />

          {hits.length === 0 && error && <ErrorPlaceholder />}

          {daySlang ? (
            <Banner
              style="duck"
              header={capitalize(daySlang.word)}
              subheader={daySlang.type + ' дня'}
              buttonText="Открыть"
            />
          ) : (
            /**
             * Если уж ошибка, то не будем показывать баннер
             * Это позволяет избавиться от мелькания при ошибке загрузки
             */
            !daySlangError &&
            !error && (
              <Skeleton
                style={{
                  marginTop: 12,
                  marginBottom: 12,
                  marginLeft: 16,
                  width: 'calc(100% - 32px)',
                  height: 102
                }}
              />
            )
          )}

          <div style={{ height: 12 }} />

          {/**
           * Будем показывать этот блок тогда, когда загрузим или получим ошибку от запроса слэнга дня
           * Это позволяет избавиться от мелькания
           */}
          {hits && (daySlang || daySlangError) ? (
            hits.length > 0 ? (
              <CardGrid size="l">
                <InfiniteScroll
                  {...other}
                  loader={
                    <>
                      <br />
                      <Spinner />
                      <br />
                    </>
                  }
                >
                  {hits.map((slang) => (
                    <SlangCard
                      {...slang}
                      key={slang.id}
                      id={'slang-card-' + slang.id}
                      onClick={() =>
                        // TODO: Убрать Object.assign, когда это будет исправлено в роутере
                        transition(
                          '/dictionary/slang',
                          Object.assign({}, slang)
                        )
                      }
                    />
                  ))}
                </InfiniteScroll>
              </CardGrid>
            ) : (
              !error && <VoidPlaceholder />
            )
          ) : (
            !error &&
            (desktop ? (
              <div style={{ marginLeft: 8, width: 'calc(100% - 16px)' }}>
                <Skeleton style={style} />
                <Skeleton style={style} />
                <Skeleton style={style} />
              </div>
            ) : (
              <Div>
                <Skeleton style={style} />
                <Skeleton style={style} />
                <Skeleton style={style} />
              </Div>
            ))
          )}
        </Group>
      </PullToRefresh>
    </Panel>
  );
};
