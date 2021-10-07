import { useState } from 'react';
import type { FC } from 'react';
import { transition } from '@unexp/router';
import {
  Group,
  Panel,
  PanelHeader,
  PanelHeaderButton,
  Search as VKUISearch,
  CardGrid,
  Banner,
  Button
} from '@vkontakte/vkui';
import { Icon28AddOutline } from '@vkontakte/icons';

import { CustomSnackbar, SlangCard } from '../components';

import duck from '../assets/duck.svg';

type Props = {
  nav: string;
};

export const Explore: FC<Props> = ({ nav }: Props) => {
  const [searchValue, setSearchValue] = useState<string>('');

  const onSearchChange = (e: any) => setSearchValue(e.target.value);

  return (
    <Panel nav={nav}>
      <PanelHeader
        separator={false}
        left={
          <PanelHeaderButton onClick={() => transition('/explore/create')}>
            <Icon28AddOutline />
          </PanelHeaderButton>
        }
      >
        Словарь
      </PanelHeader>

      <Group>
        <VKUISearch value={searchValue} onChange={onSearchChange} />
        <Banner
          mode="image"
          header="Симпл-димпл"
          subheader="Словосочитание дня"
          background={
            <div
              style={{
                background: `url(${duck}) no-repeat right bottom, linear-gradient(90deg, rgba(255,68,170,1) 0%, rgba(243,63,224,1) 50%, rgba(244,88,249,1) 100%) no-repeat`
              }}
            />
          }
          actions={<Button mode="overlay_primary">Открыть</Button>}
        />
        <CardGrid size="l">
          <SlangCard
            word="Кринж"
            rating={1231}
            creator="От Гоши Панина"
            description="Это когда тебе стыдно за Гошин дизайн"
            onClick={() => transition('/explore/project', { id: 1 })}
          />
          <SlangCard
            word="Нюхать бебру"
            rating={-94}
            creator="От редакции"
            description="Член на украинском"
          />
          <SlangCard
            word="Чилл"
            rating={0}
            creator="От редакции"
            description="Отдыхать на английском"
          />
        </CardGrid>
      </Group>

      <CustomSnackbar />
    </Panel>
  );
};
