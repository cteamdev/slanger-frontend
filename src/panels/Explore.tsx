import { useState } from 'react';
import type { FC } from 'react';
import { transition } from '@unexp/router';
import {
  Group,
  Panel,
  PanelHeader,
  PanelHeaderButton,
  Search as VKUISearch,
  CardGrid
} from '@vkontakte/vkui';
import { Icon28AddOutline } from '@vkontakte/icons';

import { CustomSnackbar, SlangCard, Banner } from '../components';

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
          style="duck"
          header="Симпл-димпл"
          subheader="Словосочетание дня"
          buttonText="Открыть"
        />
        <CardGrid size="l">
          <SlangCard
            word="Кринж"
            rating={1231}
            creator="От Гоши Панина"
            description="Это когда тебе стыдно за Гошин дизайн"
            onClick={() => transition('/explore/slang', { id: 1 })}
          />
          <SlangCard
            word="Нюхать бебру"
            rating={-94}
            creator="От редакции"
            description="Что-то на украинском"
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
