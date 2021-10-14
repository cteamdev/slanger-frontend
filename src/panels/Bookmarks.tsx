import type { CSSProperties, FC } from 'react';

import useSWR from 'swr';
import { useAtomValue } from '@mntm/precoil';
import {
  Group,
  Panel,
  PanelHeader,
  PanelHeaderButton,
  Spinner,
  PullToRefresh,
  useAdaptivity,
  ViewWidth,
  SimpleCell,
  IconButton,
  Avatar
} from '@vkontakte/vkui';
import { Icon24DeleteOutline, Icon28RefreshOutline } from '@vkontakte/icons';

import { fetcher } from '../utils';
import { Bookmark, RemoveBookmarkDto, ResponseError, User } from '../types';
import { vkUserAtom } from '../store';
import { ErrorPlaceholder, Skeleton, VoidPlaceholder } from '../components';
import { transition } from '@unexp/router';

type Props = {
  nav: string;
};

export const Bookmarks: FC<Props> = ({ nav }: Props) => {
  const { viewWidth } = useAdaptivity();

  const { id } = useAtomValue(vkUserAtom);

  const { data, error, isValidating, mutate } = useSWR<User, ResponseError>(
    `/users/getById?id=${id}`,
    fetcher
  );
  const bookmarks: Bookmark[] | undefined = data?.bookmarks;

  const desktop: boolean = (viewWidth ?? 0) >= ViewWidth.SMALL_TABLET;
  const style: CSSProperties = {
    height: 59,
    marginBottom: 2
  };

  const removeBookmark = async (id: number): Promise<void> => {
    await fetcher('/bookmarks/remove', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id } as RemoveBookmarkDto),
      throw: true
    });

    if (data)
      await mutate(
        {
          ...data,
          bookmarks: bookmarks?.filter((bookmark) => bookmark.id !== id)
        },
        false
      );
  };

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
        Закладки
      </PanelHeader>

      <PullToRefresh onRefresh={() => mutate()} isFetching={isValidating}>
        <Group>
          {error && <ErrorPlaceholder />}
          {data && bookmarks ? (
            bookmarks.length > 0 ? (
              bookmarks.map(({ id, slang }) => (
                <SimpleCell
                  key={id}
                  before={<Avatar size={48} src={slang.cover} />}
                  after={
                    <IconButton onClick={() => removeBookmark(id)}>
                      <Icon24DeleteOutline />
                    </IconButton>
                  }
                  description={slang.description}
                  onClick={() => transition('/dictionary/slang', slang)}
                >
                  {slang.word}
                </SimpleCell>
              ))
            ) : (
              <VoidPlaceholder />
            )
          ) : (
            !error && (
              <>
                <Skeleton style={style} />
                <Skeleton style={style} />
                <Skeleton style={style} />
              </>
            )
          )}
        </Group>
      </PullToRefresh>
    </Panel>
  );
};