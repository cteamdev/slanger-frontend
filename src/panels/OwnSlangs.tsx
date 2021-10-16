import type { CSSProperties, FC } from 'react';

import InfiniteScroll from 'react-infinite-scroll-component';
import { transition } from '@unexp/router';
import {
  Group,
  Panel,
  PanelHeader,
  PanelHeaderButton,
  CardGrid,
  Spinner,
  PullToRefresh,
  useAdaptivity,
  ViewWidth,
  Div,
  PanelHeaderBack
} from '@vkontakte/vkui';
import { Icon28RefreshOutline } from '@vkontakte/icons';

import {
  SlangCard,
  Skeleton,
  VoidPlaceholder,
  ErrorPlaceholder
} from '../components';
import { useMeilisearch } from '../hooks';

type Props = {
  nav: string;
};

export const OwnSlangs: FC<Props> = ({ nav }: Props) => {
  const { viewWidth } = useAdaptivity();

  const { hits, error, isValidating, mutate, ...other } = useMeilisearch(
    '/slangs/getOwn',
    10
  );

  const desktop: boolean = (viewWidth ?? 0) >= ViewWidth.SMALL_TABLET;
  const style: CSSProperties = {
    height: 104,
    marginBottom: 8
  };

  return (
    <Panel nav={nav}>
      <PanelHeader
        separator={false}
        left={<PanelHeaderBack onClick={() => transition(-1)} />}
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
        Мои слэнги
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
                >
                  {hits.map((slang) => (
                    <SlangCard
                      {...slang}
                      key={slang.id}
                      id={'slang-card-' + slang.id}
                      slangId={slang.id}
                      onClick={() =>
                        // TODO: Убрать Object.assign, когда это будет исправлено в роутере
                        transition('/profile/slang', Object.assign({}, slang))
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