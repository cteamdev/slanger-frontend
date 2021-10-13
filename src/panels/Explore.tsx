import { FC } from 'react';

import InfiniteScroll from 'react-infinite-scroll-component';
import { ChangeEvent, useState } from 'react';
import { transition } from '@unexp/router';
import {
  Group,
  Panel,
  PanelHeader,
  PanelHeaderButton,
  Search as VKUISearch,
  CardGrid,
  Placeholder,
  Spinner,
  PullToRefresh,
  useAdaptivity,
  ViewWidth
} from '@vkontakte/vkui';
import {
  Icon28AddOutline,
  Icon28RefreshOutline,
  Icon56CompassOutline,
  Icon56ErrorTriangleOutline
} from '@vkontakte/icons';

import { CustomSnackbar, SlangCard, Banner, Skeleton } from '../components';
import { useDaySlang, useMeilisearch } from '../hooks';
import { capitalize } from '../utils';

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
  const { data: daySlang, error: daySlangError } = useDaySlang();

  const desktop: boolean = (viewWidth ?? 0) >= ViewWidth.SMALL_TABLET;

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
              {isValidating ? (
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

      <PullToRefresh onRefresh={refresh} isFetching={isValidating}>
        <Group>
          <VKUISearch
            value={query}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setQuery(e.target.value)
            }
          />

          {hits.length === 0 && error && (
            <Placeholder
              icon={<Icon56ErrorTriangleOutline />}
              header="Хьюстон, у нас проблема"
            >
              Не удалось получить данные. Попробуйте позже.
            </Placeholder>
          )}

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
              !error && (
                <Placeholder icon={<Icon56CompassOutline />} header="Пустота">
                  Здесь ничего нет...
                </Placeholder>
              )
            )
          ) : (
            !error && (
              <>
                <Skeleton
                  style={{
                    height: 104,
                    marginBottom: 8
                  }}
                />
                <Skeleton
                  style={{
                    height: 104,
                    marginBottom: 8
                  }}
                />
                <Skeleton
                  style={{
                    height: 104,
                    marginBottom: 8
                  }}
                />
              </>
            )
          )}
        </Group>
      </PullToRefresh>

      <CustomSnackbar />
    </Panel>
  );
};
