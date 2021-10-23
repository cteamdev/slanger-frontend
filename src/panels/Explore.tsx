import type { CSSProperties, FC, ChangeEvent } from 'react';

import InfiniteScroll from 'react-infinite-scroll-component';
import useSWRImmutable from 'swr/immutable';
import { useEffect } from 'react';
import { useAtomState } from '@mntm/precoil';
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
import { capitalize, fetcher, uncapitalize } from '../utils';
import { ResponseError, Slang } from '../types';
import { queryAtom } from '../store';

type Props = {
  nav: string;
};

export const Explore: FC<Props> = ({ nav }: Props) => {
  const { viewWidth } = useAdaptivity();

  const [q, setQuery] = useAtomState(queryAtom);

  const { hits, error, isValidating, mutate, ...other } = useMeilisearch(
    '/slangs/search',
    10,
    { q }
  );
  const {
    data: random,
    error: randomError,
    isValidating: isRandomValidating,
    mutate: randomMutate
  } = useSWRImmutable<Slang, ResponseError>('/slangs/getRandom', fetcher);

  const desktop: boolean = (viewWidth ?? 0) >= ViewWidth.SMALL_TABLET;
  const style: CSSProperties = {
    height: 104,
    marginBottom: 8
  };

  const refresh = (): void => {
    randomMutate();
    mutate();
  };

  useEffect(() => void mutate(), []);

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
            <PanelHeaderButton onClick={refresh}>
              {isValidating || isRandomValidating ? (
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
        onRefresh={refresh}
        isFetching={isValidating || isRandomValidating}
      >
        <Group>
          <VKUISearch
            value={q}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setQuery(e.target.value)
            }
          />

          {!hits && error && <ErrorPlaceholder />}

          {random ? (
            <Banner
              style="duck"
              header={capitalize(random.word)}
              subheader={
                (random.type === 'Пословица'
                  ? 'Случайная'
                  : random.type === 'Фразеологизм'
                  ? 'Случайный'
                  : 'Случайное') +
                ' ' +
                uncapitalize(random.type)
              }
              buttonText="Открыть"
              // TODO: Убрать Object.assign, когда это будет исправлено в роутере
              onButtonClick={() =>
                transition('/dictionary/slang', Object.assign({}, random))
              }
            />
          ) : (
            /**
             * Если уж ошибка, то не будем показывать баннер
             * Это позволяет избавиться от мелькания при ошибке загрузки
             */
            !randomError &&
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
           * Будем показывать этот блок тогда, когда загрузим или получим ошибку от запроса рандом слэнга
           * Это позволяет избавиться от мелькания
           */}
          {hits && (random || randomError) ? (
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
