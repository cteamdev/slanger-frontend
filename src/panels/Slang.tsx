import { FC, useEffect } from 'react';
import { formatRelative, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';
import { transition, useHistoryState } from '@unexp/router';
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
  IconButton
} from '@vkontakte/vkui';
import {
  Icon12Verified,
  Icon20ArticleOutline,
  Icon20CalendarOutline,
  Icon24FavoriteOutline,
  Icon24ShareOutline,
  Icon28UserCircleOutline
} from '@vkontakte/icons';

import { capitalize } from '../utils';
import { Slang as TSlang } from '../types';

type Props = {
  nav: string;
};

export const Slang: FC<Props> = ({ nav }: Props) => {
  const slang: TSlang = useHistoryState();
  const { sizeX } = useAdaptivity();

  const { cover, word, type, status, user, description, date } = slang;

  useEffect(() => window.scroll({ left: 0, top: 0 }), []);

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

        <Spacing />
        <Title level="1" weight="bold" style={{ textAlign: 'center' }}>
          {word}
        </Title>
        <Spacing size={8} />
        <Title
          level="3"
          weight="regular"
          style={{ textAlign: 'center', color: '#6D7885' }}
        >
          {type}
          {status !== 'public' && ' | ' + status}
        </Title>

        <Spacing size={16} />

        {user ? (
          <SimpleCell
            before={<Avatar size={48} src={user.vk.avatarUrl} />}
            after={
              <IconButton>
                <Icon28UserCircleOutline />
              </IconButton>
            }
            badge={user.vk.verified ? <Icon12Verified /> : undefined}
            description={user.vk.verified ? 'Подтверждённый автор' : 'Автор'}
            disabled
          >
            {user.vk.fullName}
          </SimpleCell>
        ) : (
          <SimpleCell
            before={
              <Avatar
                size={48}
                src="https://sun9-11.userapi.com/impg/dycJqEhDYp71OBMwhT0ZChzYP1QD7erQ0XxtCA/3quT2uJB01I.jpg?size=1024x1024&quality=95&sign=f31ccc0d85a2d1b64ff095957b0fc369&type=album"
              />
            }
            badge={<Icon12Verified />}
            description="Подтверждённый автор"
            disabled
          >
            Редакция
          </SimpleCell>
        )}

        <Spacing size={16} />

        <MiniInfoCell
          before={<Icon20ArticleOutline />}
          textWrap="full"
          textLevel="primary"
        >
          {description}
        </MiniInfoCell>
        <MiniInfoCell
          before={<Icon20CalendarOutline />}
          textWrap="full"
          textLevel="primary"
        >
          {date &&
            capitalize(
              formatRelative(parseISO(date), new Date(), {
                locale: ru
              })
            )}
        </MiniInfoCell>

        <Div style={{ display: 'flex' }}>
          <Button
            size="l"
            stretched
            mode="secondary"
            before={<Icon24FavoriteOutline />}
            style={{ marginRight: 8 }}
          >
            Добавить в избранное
          </Button>
          <Button
            size="l"
            mode="primary"
            before={<Icon24ShareOutline />}
            onClick={() =>
              transition('/dictionary/slang?modal=share-slang', slang)
            }
          />
        </Div>
      </Group>
    </Panel>
  );
};
