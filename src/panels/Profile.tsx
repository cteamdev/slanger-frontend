import { CSSProperties, FC, MouseEvent, useEffect } from 'react';

import useSWR from 'swr';
import { formatRelative, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';
import { useSetAtomState, useAtomValue } from '@mntm/precoil';
import { transition, useHistoryState } from '@unexp/router';
import {
  Group,
  Panel,
  PanelHeader,
  PanelHeaderButton,
  Spinner,
  PullToRefresh,
  useAdaptivity,
  ViewWidth,
  Div,
  Link,
  Avatar,
  SimpleCell,
  Title,
  Gradient,
  SizeType,
  InfoRow,
  PanelHeaderBack,
  CellButton
} from '@vkontakte/vkui';
import {
  Icon28BugOutline,
  Icon28CalendarOutline,
  Icon28CancelOutline,
  Icon28ChecksOutline,
  Icon28CoinsOutline,
  Icon28KeySquareOutline,
  Icon28RefreshOutline,
  Icon28SendOutline,
  Icon28SettingsOutline,
  Icon28SubtitlesOutline,
  Icon28UserOutline
} from '@vkontakte/icons';

import { capitalize, fetcher, pluralize } from '../utils';
import {
  ResponseError,
  SetUserRightsDto,
  SnackbarIconType,
  User
} from '../types';
import { rightsAtom, snackbarAtom, vkUserAtom } from '../store';
import {
  CreditsFooter,
  ErrorPlaceholder,
  Skeleton,
  UserBadge
} from '../components';

type Props = {
  nav: string;
};

export const Profile: FC<Props> = ({ nav }: Props) => {
  const { viewWidth, sizeX } = useAdaptivity();

  const { backButton, userId: paramsId } = useHistoryState();

  const { id: currentId } = useAtomValue(vkUserAtom);
  const currentRights: string = useAtomValue(rightsAtom);

  const setSnackbar = useSetAtomState(snackbarAtom);
  const setRights = useSetAtomState(rightsAtom);

  const id: number = nav === '/' ? currentId : paramsId ?? currentId;
  const { data, error, isValidating, mutate } = useSWR<User, ResponseError>(
    id ? `/users/getById?id=${id}` : null,
    fetcher,
    { shouldRetryOnError: false }
  );

  const {
    vk: { fullName, avatarUrl, verified },
    rights,
    points,
    registration,
    dayLimitCount,
    dayLimitDate
  } = data ?? { vk: {} };

  const desktop: boolean = (viewWidth ?? 0) >= ViewWidth.SMALL_TABLET;
  const style: CSSProperties = {
    color: 'var(--button_secondary_destructive_foreground)'
  };
  const limitCount: number =
    dayLimitDate &&
    dayLimitCount &&
    parseISO(dayLimitDate).toDateString() === new Date().toDateString()
      ? dayLimitCount
      : 0;
  const rightsRu: Record<string, string> = {
    banned: 'Забанен',
    user: 'Пользователь',
    moderator: 'Модератор',
    admin: 'Администратор'
  };

  const setUserRights = async (
    rights: SetUserRightsDto['rights']
  ): Promise<void> => {
    const update: User = await fetcher('/admin/setUserRights', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, rights } as SetUserRightsDto),
      throw: true
    });

    await mutate(update, false);
    setSnackbar({ icon: SnackbarIconType.SUCCESS, text: 'Успех' });
  };

  useEffect(() => {
    if (nav === '/') setRights(rights || 'user');
  }, [data]);

  return (
    <Panel nav={nav}>
      <PanelHeader
        separator={false}
        left={
          nav === '/' ? (
            <PanelHeaderButton>
              <Icon28SettingsOutline
                onClick={() => transition('/profile?modal=settings')}
              />
            </PanelHeaderButton>
          ) : (
            backButton && <PanelHeaderBack onClick={() => transition(-1)} />
          )
        }
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
        {nav === '/' ? 'Мой профиль' : 'Профиль'}
      </PanelHeader>

      <PullToRefresh onRefresh={() => mutate()} isFetching={isValidating}>
        <Group className="Group--Profile">
          {error ? (
            <ErrorPlaceholder />
          ) : (
            <Link
              href={id ? 'https://vk.com/id' + id : 'javascript:void(0)'}
              target="_blank"
              style={
                !id
                  ? {
                      pointerEvents: 'none',
                      cursor: 'default'
                    }
                  : {}
              }
              onClick={(e: MouseEvent<HTMLElement>) =>
                !id && e.preventDefault()
              }
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center'
                }}
              >
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
                  <Avatar size={96} src={avatarUrl}>
                    {!avatarUrl && (
                      <Skeleton
                        style={{ width: 96, height: 96, borderRadius: '50%' }}
                      />
                    )}
                  </Avatar>
                  <SimpleCell
                    disabled
                    badge={<UserBadge verified={verified} rights={rights} />}
                  >
                    <Title level="2" weight="medium">
                      {fullName ?? 'Загрузка...'}
                    </Title>
                  </SimpleCell>
                </Gradient>
              </div>
            </Link>
          )}

          <Group mode="plain">
            {data ? (
              <>
                {points !== undefined && (
                  <SimpleCell before={<Icon28CoinsOutline />} disabled>
                    <InfoRow header="Баллы">
                      {points} {pluralize(points, ['балл', 'балла', 'баллов'])}
                    </InfoRow>
                  </SimpleCell>
                )}
                {dayLimitCount !== undefined && (
                  <SimpleCell before={<Icon28SendOutline />} disabled>
                    <InfoRow header="Предложено сегодня">
                      {limitCount}{' '}
                      {pluralize(limitCount, [
                        'выражение',
                        'выражения',
                        'выражений'
                      ])}
                    </InfoRow>
                  </SimpleCell>
                )}
              </>
            ) : (
              !error && (
                <Div>
                  <Skeleton />
                  <Skeleton />
                </Div>
              )
            )}
          </Group>
        </Group>

        {rights || registration ? (
          <Group>
            {rights && (
              <SimpleCell before={<Icon28ChecksOutline />} disabled>
                <InfoRow header="Права">
                  {rightsRu[rights] ?? 'Пользователь'}
                </InfoRow>
              </SimpleCell>
            )}
            {registration && (
              <SimpleCell before={<Icon28CalendarOutline />} disabled>
                <InfoRow header="Дата регистрации">
                  {capitalize(
                    formatRelative(parseISO(registration), new Date(), {
                      locale: ru
                    })
                  )}
                </InfoRow>
              </SimpleCell>
            )}
          </Group>
        ) : (
          !error && (
            <Group>
              <Div>
                <Skeleton />
                <Skeleton />
              </Div>
            </Group>
          )
        )}

        {nav === '/' && !error && (
          <Group>
            {data ? (
              <CellButton
                centered
                before={<Icon28SubtitlesOutline />}
                onClick={() => transition('/profile/ownSlangs')}
              >
                Мои сленги
              </CellButton>
            ) : (
              <Div>
                <Skeleton />
              </Div>
            )}
          </Group>
        )}

        {currentRights === 'admin' && (
          <Group>
            <CellButton
              centered
              before={<Icon28CancelOutline style={style} />}
              onClick={() => setUserRights('banned')}
              style={style}
            >
              Забанить
            </CellButton>
            <CellButton
              centered
              before={<Icon28UserOutline />}
              onClick={() => setUserRights('user')}
            >
              Выдать пользователя
            </CellButton>
            <CellButton
              centered
              before={<Icon28BugOutline />}
              onClick={() => setUserRights('moderator')}
            >
              Выдать модератора
            </CellButton>
            <CellButton
              centered
              before={<Icon28KeySquareOutline />}
              onClick={() => setUserRights('admin')}
            >
              Выдать администратора
            </CellButton>
          </Group>
        )}
      </PullToRefresh>

      {!desktop && <CreditsFooter />}
    </Panel>
  );
};
