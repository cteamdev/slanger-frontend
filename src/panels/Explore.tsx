import { CSSProperties, FC, ChangeEvent, useState } from 'react';

import InfiniteScroll from 'react-infinite-scroll-component';
import useSWRImmutable from 'swr/immutable';
import { useEffect, useRef } from 'react';
import { useAtomState } from '@mntm/precoil';
import { push } from '@itznevikat/router';
import {
  Group,
  Panel,
  PanelHeader,
  PanelHeaderButton,
  Search as VKUISearch,
  CardGrid,
  Spinner,
  PullToRefresh,
  ViewWidth,
  Div
} from '@vkontakte/vkui';
import { Icon28AddOutline, Icon28RefreshOutline } from '@vkontakte/icons';

import {
  SlangCard,
  Banner,
  Skeleton,
  VoidPlaceholder,
  ErrorPlaceholder,
  EndFooter
} from '../components';
import { useMeilisearch, useAdaptivity } from '../hooks';
import { capitalize, fetcher, uncapitalize } from '../utils';
import { ResponseError, Slang } from '../types';
import { queryAtom } from '../store';

type Props = {
  nav: string;
};

export const Explore: FC<Props> = ({ nav }: Props) => {
  const { viewWidth } = useAdaptivity();

  const [q, setQuery] = useAtomState(queryAtom);
  const [searchValue, setSearchValue] = useState(q);
  const searchTimeout = useRef<number | undefined>();

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

  const onSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);

    searchTimeout.current = setTimeout(() => setQuery(e.target.value), 400);
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
          <PanelHeaderButton onClick={() => push('/create')}>
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
        ??????????????
      </PanelHeader>

      <PullToRefresh
        onRefresh={refresh}
        isFetching={isValidating || isRandomValidating}
      >
        <Group>
          <VKUISearch value={searchValue} onChange={onSearchChange} />

          {!hits && error && <ErrorPlaceholder />}

          {random ? (
            <Banner
              style="duck"
              header={capitalize(random.word)}
              subheader={
                (random.type === '??????????????????'
                  ? '??????????????????'
                  : random.type === '????????????????????????'
                  ? '??????????????????'
                  : '??????????????????') +
                ' ' +
                uncapitalize(random.type)
              }
              buttonText="??????????????"
              onButtonClick={() => push('/slang', random)}
            />
          ) : (
            /**
             * ???????? ???? ????????????, ???? ???? ?????????? ???????????????????? ????????????
             * ?????? ?????????????????? ???????????????????? ???? ?????????????????? ?????? ???????????? ????????????????
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
           * ?????????? ???????????????????? ???????? ???????? ??????????, ?????????? ???????????????? ?????? ?????????????? ???????????? ???? ?????????????? ???????????? ????????????
           * ?????? ?????????????????? ???????????????????? ???? ??????????????????
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
                  endMessage={<EndFooter />}
                >
                  {hits.map((slang) => (
                    <SlangCard
                      {...slang}
                      key={slang.id}
                      id={'slang-card-' + slang.id}
                      onClick={() => push('/slang', slang)}
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
