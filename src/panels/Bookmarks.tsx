import type { CSSProperties, FC, MouseEvent } from 'react';

import useSWR from 'swr';
import { useAtomValue } from '@mntm/precoil';
import { transition } from '@unexp/router';
import {
  Group,
  Panel,
  PanelHeader,
  PanelHeaderButton,
  Spinner,
  PullToRefresh,
  ViewWidth,
  SimpleCell,
  IconButton,
  Avatar,
  Div
} from '@vkontakte/vkui';
import { Icon24DeleteOutline, Icon28RefreshOutline } from '@vkontakte/icons';

import { useAdaptivity } from '../hooks';
import { fetcher } from '../utils';
import { vkUserAtom } from '../store';
import { Bookmark, RemoveBookmarkDto, ResponseError, User } from '../types';
import { ErrorPlaceholder, Skeleton, VoidPlaceholder } from '../components';

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

  const removeBookmark = async (
    e: MouseEvent<HTMLElement>,
    id: number
  ): Promise<void> => {
    e.stopPropagation();

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
                  before={
                    <Avatar
                      size={48}
                      src={
                        slang.cover ??
                        'https://sun9-11.userapi.com/impg/dycJqEhDYp71OBMwhT0ZChzYP1QD7erQ0XxtCA/3quT2uJB01I.jpg?size=1024x1024&quality=95&sign=f31ccc0d85a2d1b64ff095957b0fc369&type=album'
                      }
                    />
                  }
                  after={
                    <IconButton
                      onClick={(e: MouseEvent<HTMLElement>) =>
                        removeBookmark(e, id)
                      }
                    >
                      <Icon24DeleteOutline />
                    </IconButton>
                  }
                  description={slang.description}
                  onClick={() => transition('/bookmarks/slang', slang)}
                >
                  {slang.word}
                </SimpleCell>
              ))
            ) : (
              <VoidPlaceholder />
            )
          ) : (
            !error &&
            (desktop ? (
              <>
                <Skeleton style={style} />
                <Skeleton style={style} />
                <Skeleton style={style} />
              </>
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
