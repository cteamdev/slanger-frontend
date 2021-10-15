import type { FC } from 'react';

import useSWR from 'swr';
import { formatRelative, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';
import { useAtomValue } from '@mntm/precoil';
import { transition, useParams } from '@unexp/router';
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
  InfoRow
} from '@vkontakte/vkui';
import {
  Icon28CalendarOutline,
  Icon28ChecksOutline,
  Icon28CoinsOutline,
  Icon28RefreshOutline,
  Icon28SendOutline,
  Icon28SettingsOutline
} from '@vkontakte/icons';

import { capitalize, fetcher, pluralize } from '../utils';
import { ResponseError, User } from '../types';
import { vkUserAtom } from '../store';
import { ErrorPlaceholder, Skeleton, UserBadge } from '../components';

type Props = {
  nav: string;
};

export const Profile: FC<Props> = ({ nav }: Props) => {
  const { viewWidth, sizeX } = useAdaptivity();
  const { id: paramsId } = useParams();
  const { id: currentId } = useAtomValue(vkUserAtom);

  const id: number = nav === '/' ? currentId : paramsId ?? currentId;
  const { data, error, isValidating, mutate } = useSWR<User, ResponseError>(
    id ? `/users/getById?id=${id}` : null,
    fetcher
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

  return (
    <Panel nav={nav}>
      <PanelHeader
        separator={false}
        left={
          nav === '/' && (
            <PanelHeaderButton>
              <Icon28SettingsOutline
                onClick={() => transition('/profile?modal=settings')}
              />
            </PanelHeaderButton>
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
        Профиль
      </PanelHeader>

      <PullToRefresh onRefresh={() => mutate()} isFetching={isValidating}>
        <Group className="Group--Profile">
          {error ? (
            <ErrorPlaceholder />
          ) : (
            <Link href={`https://vk.com/id${id}`} target="_blank">
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
                {points && (
                  <SimpleCell before={<Icon28CoinsOutline />} disabled>
                    <InfoRow header="Баллы">
                      {points} {pluralize(points, ['балл', 'балла', 'баллов'])}
                    </InfoRow>
                  </SimpleCell>
                )}
                {dayLimitCount && (
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

        <Group>
          {rights || registration ? (
            <>
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
                      formatRelative(new Date(), parseISO(registration), {
                        locale: ru
                      })
                    )}
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
      </PullToRefresh>
    </Panel>
  );
};
