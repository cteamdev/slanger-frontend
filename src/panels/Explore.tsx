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
  Placeholder
} from '@vkontakte/vkui';
import { Icon28AddOutline, Icon56ErrorTriangleOutline } from '@vkontakte/icons';

import { CustomSnackbar, SlangCard, Banner, Skeleton } from '../components';
import { useDaySlang, useSlangs } from '../hooks';
import { capitalize } from '../utils';

type Props = {
  nav: string;
};

export const Explore: FC<Props> = ({ nav }: Props) => {
  const [searchValue, setSearchValue] = useState<string>('');

  const { data: slangs, error: slangsError } = useSlangs(searchValue, 0, 10);
  const { data: daySlang, error: daySlangError } = useDaySlang();

  const onSearchChange = (e: any) => setSearchValue(e.target.value);

  return (
    <Panel nav={nav}>
      <PanelHeader
        separator={false}
        left={
          <PanelHeaderButton onClick={() => transition('/create')}>
            <Icon28AddOutline />
          </PanelHeaderButton>
        }
      >
        Словарь
      </PanelHeader>

      <Group>
        <VKUISearch value={searchValue} onChange={onSearchChange} />

        {(slangsError || daySlangError) && (
          <Placeholder icon={<Icon56ErrorTriangleOutline />} header="Ошибка">
            К сожалению, у нас не вышло получить данные. Попробуйте позже.
          </Placeholder>
        )}

        {daySlang ? (
          <Banner
            style="duck"
            header={capitalize(daySlang.word)}
            subheader={daySlang.type + ' дня'}
            buttonText="Открыть"
          />
        ) : (
          !daySlangError && (
            <Skeleton
              style={{
                marginTop: 12,
                marginBottom: 12,
                marginLeft: 16,
                width: 'calc(100% - 32px)',
                height: 102
              }}
            />
          )
        )}

        <div style={{ height: 12 }} />

        <CardGrid size="l">
          {slangs
            ? // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              slangs.hits.map((slang) => (
                <SlangCard
                  {...slang}
                  key={slang.id}
                  id={'slang-card-' + slang.id}
                  onClick={() => transition('/slang', slang)}
                />
              ))
            : !slangsError && (
                <>
                  <Skeleton
                    style={{
                      height: 104,
                      marginBottom: 8
                    }}
                  />
                  <Skeleton
                    style={{
                      height: 104,
                      marginBottom: 8
                    }}
                  />
                  <Skeleton
                    style={{
                      height: 104,
                      marginBottom: 8
                    }}
                  />
                </>
              )}
        </CardGrid>
      </Group>

      <CustomSnackbar />
    </Panel>
  );
};
