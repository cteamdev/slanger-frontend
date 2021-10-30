import type { CSSProperties, FC } from 'react';

import InfiniteScroll from 'react-infinite-scroll-component';
import { useEffect } from 'react';
import { transition } from '@unexp/router';
import {
  Group,
  Panel,
  PanelHeader,
  PanelHeaderButton,
  CardGrid,
  Spinner,
  PullToRefresh,
  ViewWidth,
  Div
} from '@vkontakte/vkui';
import { Icon28RefreshOutline } from '@vkontakte/icons';

import {
  SlangCard,
  Skeleton,
  VoidPlaceholder,
  ErrorPlaceholder,
  EndFooter
} from '../components';
import { useMeilisearch, useAdaptivity } from '../hooks';

type Props = {
  nav: string;
};

export const AdminExplore: FC<Props> = ({ nav }: Props) => {
  const { viewWidth } = useAdaptivity();

  const { hits, error, isValidating, mutate, ...other } = useMeilisearch(
    '/admin/search',
    10
  );

  const desktop: boolean = (viewWidth ?? 0) >= ViewWidth.SMALL_TABLET;
  const style: CSSProperties = {
    height: 104,
    marginBottom: 8
  };

  useEffect(() => void mutate(), []);

  return (
    <Panel nav={nav}>
      <PanelHeader
        separator={false}
        right={
          desktop && (
            <PanelHeaderButton onClick={() => mutate()}>
              {isValidating ? (
                <Spinner style={{ marginRight: 2 }} />
              ) : (
                <Icon28RefreshOutline />
              )}
            </PanelHeaderButton>
          )
        }
      >
        Модерация
      </PanelHeader>

      <PullToRefresh onRefresh={mutate} isFetching={isValidating}>
        <Group>
          {!hits && error && <ErrorPlaceholder />}
          {hits ? (
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
                  endMessage={<EndFooter />}
                >
                  {hits.map((slang) => (
                    <SlangCard
                      {...slang}
                      key={slang.id}
                      id={'slang-card-' + slang.id}
                      slangId={slang.id}
                      onClick={() =>
                        // TODO: Убрать Object.assign, когда это будет исправлено в роутере
                        transition('/admin/slang', Object.assign({}, slang))
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
