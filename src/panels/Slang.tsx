import type { CSSProperties, FC } from 'react';

import useSWR, { mutate as swrMutate } from 'swr';
import useSWRImmutable from 'swr/immutable';
import { useEffect, useReducer } from 'react';
import { formatRelative, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';
import { useAtomValue, useSetAtomState } from '@mntm/precoil';
import { send, UserInfo } from '@vkontakte/vk-bridge';
import {
  transition,
  useDeserializedLocation,
  useHistoryState,
  useParams
} from '@unexp/router';
import {
  Div,
  Group,
  Panel,
  PanelHeader,
  Title,
  Spacing,
  PanelHeaderBack,
  MiniInfoCell,
  Button,
  Gradient,
  useAdaptivity,
  SizeType,
  SimpleCell,
  Avatar,
  IconButton,
  ViewWidth,
  CellButton,
  Separator
} from '@vkontakte/vkui';
import {
  Icon20ArticleOutline,
  Icon20CalendarOutline,
  Icon24FavoriteOutline,
  Icon24ShareOutline,
  Icon24UnfavoriteOutline,
  Icon28AppleWatchOutlite,
  Icon28CancelOutline,
  Icon28ChecksOutline,
  Icon28DeleteOutline,
  Icon28EditOutline,
  Icon28UserCircleOutline
} from '@vkontakte/icons';

import { capitalize, fetcher } from '../utils';
import {
  Bookmark,
  CreateBookmarkDto,
  RemoveBookmarkDto,
  ResponseError,
  SetSlangStatusDto,
  Slang as TSlang,
  SnackbarIconType
} from '../types';
import {
  ErrorPlaceholder,
  Skeleton,
  SlangDeleteAlert,
  UserBadge
} from '../components';
import {
  gifAtom,
  popoutAtom,
  rightsAtom,
  snackbarAtom,
  vkUserAtom
} from '../store';

type Props = {
  nav: string;
};

export const Slang: FC<Props> = ({ nav }: Props) => {
  const { viewWidth, sizeX } = useAdaptivity();

  const { view } = useDeserializedLocation();
  const { slangId: paramsId } = useParams();

  const vkUser: UserInfo = useAtomValue(vkUserAtom);
  const rights: string = useAtomValue(rightsAtom);

  const setPopout = useSetAtomState(popoutAtom);
  const setSnackbar = useSetAtomState(snackbarAtom);
  const setGif = useSetAtomState(gifAtom);

  // Нехорошо так делать, но пока так придется
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  const {
    ad = true,
    ...slang
  }: (TSlang & Record<string, unknown>) | undefined = useHistoryState();
  const id: number = paramsId ? +paramsId : slang.id;

  const { data, error, mutate } = useSWR<TSlang, ResponseError>(
    paramsId ? `/slangs/getById?id=${id}` : null,
    fetcher,
    {
      revalidateIfStale: true
    }
  );

  const {
    data: bookmark,
    isValidating: isBookmarkValidating,
    mutate: mutateBookmark
  } = useSWRImmutable<Bookmark | null, ResponseError>(
    id ? `/bookmarks/has?slangId=${id}` : null,
    fetcher,
    {
      revalidateIfStale: true
    }
  );

  const desktop: boolean = (viewWidth ?? 0) >= ViewWidth.SMALL_TABLET;
  const isModerator: boolean = ['moderator', 'admin'].includes(rights);
  const style: CSSProperties = {
    color: 'var(--button_secondary_destructive_foreground)'
  };
  const statusRu: Record<string, string> = {
    moderating: 'На модерации',
    declined: 'Отклонено модерацией'
  };

  const { cover, word, type, status, user, description, date } = paramsId
    ? data ?? {}
    : slang ?? {};

  const updateBookmark = async (): Promise<void> => {
    const update: Bookmark = await fetcher(
      bookmark ? '/bookmarks/remove' : '/bookmarks/create',
      {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          bookmark
            ? ({ id: bookmark.id } as RemoveBookmarkDto)
            : ({ slangId: id } as CreateBookmarkDto)
        ),
        throw: true
      }
    );

    await mutateBookmark(bookmark ? null : update, false);
    setSnackbar({
      icon: SnackbarIconType.SUCCESS,
      text: 'Успешно ' + (bookmark ? 'убрано' : 'добавлено')
    });
  };

  const setSlangStatus = async (status: TSlang['status']): Promise<void> => {
    const update: TSlang = await fetcher('/admin/setSlangStatus', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status } as SetSlangStatusDto),
      throw: true
    });

    if (data) {
      await mutate(update, false);
    } else {
      slang.status = status;
      forceUpdate();
    }

    await swrMutate('/admin/search');
    setSnackbar({ icon: SnackbarIconType.SUCCESS, text: 'Успех' });
  };

  useEffect(() => {
    window.scroll({ left: 0, top: 0 });
    mutateBookmark(null, true);

    // На рандоме показываем рекламку
    if (ad && Math.floor(Math.random() * 5) === 1)
      send('VKWebAppShowNativeAds', { ad_format: 'interstitial' });
  }, []);

  return (
    <Panel nav={nav}>
      <PanelHeader
        left={<PanelHeaderBack onClick={() => transition(-1)} />}
        separator={false}
      />

      <Group separator="hide">
        {cover && (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Gradient
              style={{
                margin: sizeX === SizeType.REGULAR ? '-7px -7px 0 -7px' : 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                padding: 32,
                width: '100%'
              }}
            >
              <img
                src={cover}
                alt={word}
                loading="lazy"
                crossOrigin="anonymous"
                style={{
                  width: '65%',
                  height: 'auto',
                  borderRadius: 4
                }}
              />
            </Gradient>
          </div>
        )}

        {error && <ErrorPlaceholder />}

        <Spacing />
        {!error && (
          <>
            <Title level="1" weight="bold" style={{ textAlign: 'center' }}>
              {word ?? 'Загрузка...'}
            </Title>
            <Spacing size={8} />
            <Title
              level="3"
              weight="regular"
              style={{ textAlign: 'center', color: '#6D7885' }}
            >
              {type ?? 'Загрузка...'} | №{id}
              {status && status !== 'public' && ' | ' + statusRu[status]}
            </Title>
          </>
        )}

        {!error && <Spacing size={16} />}

        {!error && (vkUser.id === user?.id || isModerator) && (
          <>
            {(status === 'moderating' || isModerator) && (
              <CellButton
                centered
                before={<Icon28EditOutline />}
                onClick={() => {
                  if (cover) setGif(cover);
                  transition(view + '/editSlang', slang);
                }}
              >
                Редактировать
              </CellButton>
            )}
            <CellButton
              centered
              before={<Icon28DeleteOutline style={style} />}
              style={style}
              onClick={() => setPopout(<SlangDeleteAlert />)}
            >
              Удалить
            </CellButton>

            <Spacing size={12} />
            <Separator />
            <Spacing size={12} />
          </>
        )}

        {word && isModerator && (
          <>
            <CellButton
              centered
              before={<Icon28ChecksOutline />}
              onClick={() => setSlangStatus('public')}
            >
              Одобрить
            </CellButton>
            <CellButton
              centered
              before={<Icon28AppleWatchOutlite />}
              onClick={() => setSlangStatus('moderating')}
            >
              Отправить на модерацию
            </CellButton>
            <CellButton
              centered
              before={<Icon28CancelOutline style={style} />}
              style={style}
              onClick={() => setSlangStatus('declined')}
            >
              Отклонить
            </CellButton>

            <Spacing size={12} />
            <Separator />
            <Spacing size={12} />
          </>
        )}

        {user ? (
          <SimpleCell
            before={<Avatar size={48} src={user.vk.avatarUrl} />}
            after={
              <IconButton
                onClick={() =>
                  transition(`${view}/otherProfile?userId=${user.id}`, {
                    backButton: true,
                    // При переходе сначала сброс состояния, а потом анимация. Из-за этого видим загрузку при переходе
                    // Так как Profile не требует historyState, то передаем туда то, что сами приняли
                    ...slang
                  })
                }
              >
                <Icon28UserCircleOutline />
              </IconButton>
            }
            badge={<UserBadge verified={user.vk.verified} />}
            description={user.vk.verified ? 'Подтверждённый автор' : 'Автор'}
            disabled
          >
            {user.vk.fullName}
          </SimpleCell>
        ) : (paramsId ? data && !error : true) ? (
          <SimpleCell
            before={
              <Avatar
                size={48}
                src="https://sun9-11.userapi.com/impg/dycJqEhDYp71OBMwhT0ZChzYP1QD7erQ0XxtCA/3quT2uJB01I.jpg?size=1024x1024&quality=95&sign=f31ccc0d85a2d1b64ff095957b0fc369&type=album"
              />
            }
            badge={<UserBadge verified={true} />}
            description="Подтверждённый автор"
            disabled
          >
            Редакция
          </SimpleCell>
        ) : (
          !error && (
            <Div>
              <Skeleton />
            </Div>
          )
        )}

        {!error && <Spacing size={16} />}

        {description ? (
          <MiniInfoCell
            before={<Icon20ArticleOutline />}
            textWrap="full"
            textLevel="primary"
          >
            {description}
          </MiniInfoCell>
        ) : (
          !error && (
            <Div>
              <Skeleton style={{ height: 102 }} />
            </Div>
          )
        )}

        {date ? (
          <MiniInfoCell
            before={<Icon20CalendarOutline />}
            textWrap="full"
            textLevel="primary"
          >
            {capitalize(
              formatRelative(parseISO(date), new Date(), {
                locale: ru
              })
            )}
          </MiniInfoCell>
        ) : (
          !error && (
            <Div>
              <Skeleton />
            </Div>
          )
        )}

        {!error && (
          <Div style={{ display: 'flex' }}>
            {!isBookmarkValidating ? (
              <Button
                size="l"
                stretched
                mode="secondary"
                before={
                  bookmark ? (
                    <Icon24UnfavoriteOutline />
                  ) : (
                    <Icon24FavoriteOutline />
                  )
                }
                style={{ marginRight: 8 }}
                onClick={updateBookmark}
              >
                {bookmark ? 'Удалить из избранного' : 'Добавить в избранное'}
              </Button>
            ) : (
              <Skeleton style={{ height: desktop ? 36 : 44, marginRight: 8 }} />
            )}
            {word ? (
              <Button
                size="l"
                mode="primary"
                before={<Icon24ShareOutline />}
                onClick={() =>
                  transition('/dictionary/slang?modal=share-slang', slang)
                }
              />
            ) : (
              <Skeleton style={{ width: 64, height: desktop ? 36 : 44 }} />
            )}
          </Div>
        )}
      </Group>
    </Panel>
  );
};
