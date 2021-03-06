import { CSSProperties, FC, useState } from 'react';

import useSWR from 'swr';
import useSWRImmutable from 'swr/immutable';
import { useEffect, useReducer } from 'react';
import { formatRelative, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';
import { useAtomValue, useSetAtomState } from '@mntm/precoil';
import { UserInfo } from '@vkontakte/vk-bridge';
import { back, push, useDeserialized, useMeta } from '@itznevikat/router';
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
  SizeType,
  SimpleCell,
  Avatar,
  IconButton,
  ViewWidth,
  CellButton,
  Separator,
  Chip,
  Text
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
import { ErrorPlaceholder, Skeleton, UserBadge } from '../components';
import {
  disabledAtom,
  gifAtom,
  rightsAtom,
  snackbarAtom,
  valuesAtom,
  vkUserAtom
} from '../store';
import { useAdaptivity } from '../hooks';
import { types, voidValues } from '../components/SlangForm';

type Props = {
  nav: string;
};

export const Slang: FC<Props> = ({ nav }: Props) => {
  const { viewWidth, sizeX } = useAdaptivity();

  const { view, panel } = useDeserialized();

  const slang: TSlang = useMeta();
  const { slangId: paramsId } = useMeta();

  const vkUser: UserInfo = useAtomValue(vkUserAtom);
  const rights: string = useAtomValue(rightsAtom);

  const setSnackbar = useSetAtomState(snackbarAtom);
  const setValues = useSetAtomState(valuesAtom);
  const setDisabled = useSetAtomState(disabledAtom);
  const setGif = useSetAtomState(gifAtom);

  // ???????????????? ?????? ????????????, ???? ???????? ?????? ????????????????
  const [, forceUpdate] = useReducer((x) => x + 1, 0);
  const [bookmarkDisabled, setBookmarkDisabled] = useState<boolean>(false);

  const id: number = paramsId ?? slang.id;

  const { data, error, mutate } = useSWR<TSlang, ResponseError>(
    paramsId !== undefined ? `/slangs/getById?id=${id}` : null,
    fetcher
  );

  const {
    data: bookmark,
    isValidating: isBookmarkValidating,
    mutate: mutateBookmark
  } = useSWRImmutable<Bookmark | null, ResponseError>(
    id !== undefined ? `/bookmarks/has?slangId=${id}` : null,
    fetcher,
    {
      shouldRetryOnError: false
    }
  );

  const desktop: boolean = (viewWidth ?? 0) >= ViewWidth.SMALL_TABLET;
  const isModerator: boolean = ['moderator', 'admin'].includes(rights);
  const style: CSSProperties = {
    color: 'var(--button_secondary_destructive_foreground)'
  };
  const statusRu: Record<string, string> = {
    moderating: '???? ??????????????????',
    declined: '?????????????????? ????????????????????'
  };

  const { cover, word, type, themes, status, user, description, date } =
    paramsId !== undefined ? data ?? {} : slang ?? {};

  const editSlang = () => {
    setGif(cover ?? null);
    setDisabled(true);
    if (type && word && description && themes)
      setValues({
        type: types.indexOf(type) + 1,
        word: word,
        description: description,
        themes: themes,
        fromEdition: !user
      });

    push((view === '/' ? '' : view) + '/editSlang', { ...slang, id });
  };

  const updateBookmark = async (): Promise<void> => {
    setBookmarkDisabled(true);

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
    setBookmarkDisabled(false);
    setSnackbar({
      icon: SnackbarIconType.SUCCESS,
      text: '?????????????? ' + (bookmark ? '????????????' : '??????????????????')
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

    setSnackbar({ icon: SnackbarIconType.SUCCESS, text: '??????????????' });
  };

  useEffect(() => {
    window.scroll({ left: 0, top: 0 });
    mutateBookmark(null, true);

    setValues(voidValues);
    setDisabled(false);
    setGif(null);
  }, []);

  return (
    <Panel nav={nav}>
      <PanelHeader
        left={<PanelHeaderBack onClick={back} />}
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
              {word ?? '????????????????...'}
            </Title>
            <Spacing size={8} />
            <Title
              level="3"
              weight="regular"
              style={{ textAlign: 'center', color: '#6D7885' }}
            >
              {type ?? '????????????????...'} | ???{id}
              {status && status !== 'public' && ' | ' + statusRu[status]}
            </Title>

            {themes && (
              <Div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  flexWrap: 'wrap',
                  marginTop: 0
                }}
              >
                {themes.map((theme, index) => (
                  <Chip
                    key={index}
                    value={theme}
                    removable={false}
                    style={{ marginRight: 6, marginTop: 6 }}
                  >
                    {theme}
                  </Chip>
                ))}
              </Div>
            )}
          </>
        )}

        {!error && <Spacing size={16} />}

        {!error &&
          ((['moderating', 'declined'].includes(status || '') &&
            vkUser.id === user?.id) ||
            isModerator) && (
            <>
              <CellButton
                centered
                before={<Icon28EditOutline />}
                onClick={editSlang}
              >
                ??????????????????????????
              </CellButton>

              <CellButton
                centered
                before={<Icon28DeleteOutline style={style} />}
                style={style}
                onClick={() =>
                  push(
                    `${
                      view === '/' ? '' : view
                    }${panel}?popout=slang-delete-alert`,
                    {
                      id
                    }
                  )
                }
              >
                ??????????????
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
              ????????????????
            </CellButton>
            <CellButton
              centered
              before={<Icon28AppleWatchOutlite />}
              onClick={() => setSlangStatus('moderating')}
            >
              ?????????????????? ???? ??????????????????
            </CellButton>
            <CellButton
              centered
              before={<Icon28CancelOutline style={style} />}
              style={style}
              onClick={() => setSlangStatus('declined')}
            >
              ??????????????????
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
                  push(`${view === '/' ? '' : view}/otherProfile`, {
                    backButton: true,
                    userId: user.id,
                    // ?????? ???????????????? ?????????????? ?????????? ??????????????????, ?? ?????????? ????????????????. ????-???? ?????????? ?????????? ???????????????? ?????? ????????????????
                    // ?????? ?????? Profile ???? ?????????????? historyState, ???? ???????????????? ???????? ????, ?????? ???????? ??????????????
                    ...slang
                  })
                }
              >
                <Icon28UserCircleOutline />
              </IconButton>
            }
            badge={<UserBadge verified={user.vk.verified} />}
            description={user.vk.verified ? '???????????????????????????? ??????????' : '??????????'}
            disabled
          >
            {user.vk.fullName}
          </SimpleCell>
        ) : (paramsId !== undefined ? data && !error : true) ? (
          <SimpleCell
            before={
              <Avatar
                size={48}
                src="https://sun9-11.userapi.com/impg/dycJqEhDYp71OBMwhT0ZChzYP1QD7erQ0XxtCA/3quT2uJB01I.jpg?size=1024x1024&quality=95&sign=f31ccc0d85a2d1b64ff095957b0fc369&type=album"
              />
            }
            badge={<UserBadge verified={true} />}
            description="???????????????????????????? ??????????"
            disabled
          >
            ????????????????
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
            <Text weight="regular" style={{ whiteSpace: 'pre-line' }}>
              {description}
            </Text>
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
            {isBookmarkValidating ? (
              <Skeleton style={{ height: desktop ? 36 : 44, marginRight: 8 }} />
            ) : (
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
                disabled={bookmarkDisabled}
                style={{ marginRight: 8 }}
                onClick={updateBookmark}
              >
                {window.innerWidth < 334
                  ? '????????????????'
                  : bookmark
                  ? '?????????????? ???? ????????????????'
                  : '???????????????? ?? ????????????????'}
              </Button>
            )}
            {word ? (
              <Button
                size="l"
                mode="primary"
                before={<Icon24ShareOutline />}
                onClick={() =>
                  push(`${view === '/' ? '' : view}/slang?modal=share-slang`, {
                    ...(data ?? slang),
                    id
                  })
                }
              />
            ) : (
              <Skeleton style={{ width: 64, height: desktop ? 36 : 44 }} />
            )}
          </Div>
        )}
      </Group>

      {desktop && <div style={{ height: 16 }} />}
    </Panel>
  );
};
