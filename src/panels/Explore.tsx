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
import { Slang } from '../types';

type Props = {
  nav: string;
};

export const Explore: FC<Props> = ({ nav }: Props) => {
  const [searchValue, setSearchValue] = useState<string>('');

  const onSearchChange = (e: any) => setSearchValue(e.target.value);

  const slangs: Slang[] = [
    {
      status: 'moderating',
      date: '2021-10-11T14:31:05.197Z',
      type: 'Слово',
      cover:
        'https://media0.giphy.com/media/RJAjTowsU0K1a/giphy.gif?cid=ecf05e47fc0wneedoxr34b7jky0b14ihnycg5ggnjfefwdn0&rid=giphy.gif&ct=g',
      word: 'Кринж',
      description:
        'По смыслу слово «кринж» близко к выражению «испанский стыд». Соответственно, это чувство стыда за действие другого человека, которое преувеличено в несколько раз. Появилось даже производное прилагательное, образованное от слова «кринж», — кринжовый.',
      user: {
        points: 0,
        rights: 'user',
        ref: 'other',
        registration: '2021-10-11T14:30:11.537Z',
        dayLimitCount: 1,
        vk: {
          id: 435214391,
          avatarUrl:
            'https://sun2-4.userapi.com/s/v1/ig2/PU6sjZb29rx5FKA7Dyll04IthKxoL9gCXaqdTLKd9egDMV3wPQHC9r78hd8AN7hNrEfBTdG_Lg9Azio_LAN2Qx-A.jpg?size=200x200&quality=96&crop=284,19,614,614&ava=1',
          verified: false,
          fullName: 'Никита Кошеленко'
        },
        id: 435214391,
        dayLimitDate: '2021-10-11T14:31:05.223Z'
      },
      votes: 203,
      id: 1
    }
  ];

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

        <div style={{ height: 12 }} />

        <CardGrid size="l">
          {slangs.map((slang) => (
            <SlangCard
              {...slang}
              key={slang.id}
              id={'slang-card-' + slang.id}
              onClick={() => transition('/explore/slang', slang)}
            />
          ))}
        </CardGrid>
      </Group>

      <CustomSnackbar />
    </Panel>
  );
};
