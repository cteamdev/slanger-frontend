import type { FC } from 'react';
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
  Spinner
} from '@vkontakte/vkui';
import {
  Icon20ArticleOutline,
  Icon24FavoriteOutline,
  Icon28ShareOutline
} from '@vkontakte/icons';
import { useState } from 'react';

type Props = {
  nav: string;
};

export const Slang: FC<Props> = ({ nav }: Props) => {
  const { sizeX } = useAdaptivity();
  const { id } = useHistoryState();

  const [showSpinner, setShowSpinner] = useState(true);
  console.log(id);

  return (
    <Panel nav={nav}>
      <PanelHeader
        left={<PanelHeaderBack onClick={() => transition(-1)} />}
        separator={false}
      />

      <Group separator="hide">
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
              src="https://media0.giphy.com/media/RJAjTowsU0K1a/giphy.gif?cid=ecf05e47fc0wneedoxr34b7jky0b14ihnycg5ggnjfefwdn0&rid=giphy.gif&ct=g"
              alt="кринж" // TODO: заменить
              crossOrigin="anonymous"
              onLoad={() => setShowSpinner(false)}
              style={{
                width: '65%',
                borderRadius: 4
              }}
            />
            {showSpinner && <Spinner size="large" />}
          </Gradient>
        </div>

        <Spacing />
        <Title level="1" weight="bold" style={{ textAlign: 'center' }}>
          Кринж
        </Title>
        <Spacing size={8} />
        <Title
          level="3"
          weight="regular"
          style={{ textAlign: 'center', color: '#6D7885' }}
        >
          Слово
        </Title>
        <Spacing size={16} />
        <MiniInfoCell
          before={<Icon20ArticleOutline />}
          textWrap="full"
          textLevel="primary"
        >
          По смыслу слово «кринж» близко к выражению «испанский стыд».
          Соответственно, это чувство стыда за действие другого человека,
          которое преувеличено в несколько раз. Появилось даже производное
          прилагательное, образованное от слова «кринж», — кринжовый.
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
          <Button size="l" before={<Icon28ShareOutline />} />
        </Div>
      </Group>
    </Panel>
  );
};
