import './ChooseGif.css';

import type { ChangeEvent, FC } from 'react';
import type { GifsResult } from '@giphy/js-fetch-api';
import { useRef, useState } from 'react';
import {
  Avatar,
  Caption,
  CellButton,
  Div,
  Group,
  Placeholder,
  Search as VKUISearch
} from '@vkontakte/vkui';
import { useAtomState } from '@mntm/precoil';
import { transition } from '@unexp/router';

import { gifAtom } from '../../store';
import { delay, giphy } from '../../utils';

import { ImageGrid, ImageGridItem } from '../ImageGrid';
import { Icon24DeleteOutline, Icon56CompassOutline } from '@vkontakte/icons';

const GiphyCaption: FC = () => (
  <Caption
    level="1"
    weight="regular"
    style={{ textAlign: 'center', color: '#909499' }}
  >
    Обложки представлены сервисом{' '}
    <a href="https://giphy.com" target="_blank" style={{ color: 'inherit' }}>
      Giphy.com
    </a>
  </Caption>
);

export const ChooseGif: FC = () => {
  const [searchValue, setSearchValue] = useState<string>('');
  const [gifs, setGifs] = useState<GifsResult['data']>([]);

  const searchTimeout = useRef<number | undefined>();

  const [gif, setGif] = useAtomState(gifAtom);

  const close = () => transition(-1);
  const onSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);

    searchTimeout.current = setTimeout(() => {
      console.log(e.target.value);
      if (e.target.value.trim().length > 0) {
        setGifs([]);
        giphy
          .search(e.target.value, { limit: 10, sort: 'relevant', type: 'gifs' })
          .then((gifs) => {
            console.log(gifs);
            setGifs(gifs.data);
          });
      }
    }, 1000);
  };

  const getLink = (id: string | number): string =>
    `https://media1.giphy.com/media/${id}/giphy.gif`;

  const pickGif = async (id: string | number): Promise<void> => {
    close();
    await delay(250);

    setGif(getLink(id));
  };

  return (
    <>
      <VKUISearch value={searchValue} onChange={onSearchChange} />
      <Group separator="hide">
        {gif ? (
          <CellButton
            before={
              <Avatar shadow={false} size={40}>
                <Icon24DeleteOutline />
              </Avatar>
            }
            onClick={() => setGif(null)}
          >
            Удалить обложку
            <GiphyCaption />
          </CellButton>
        ) : (
          <GiphyCaption />
        )}
      </Group>

      <Group>
        {gifs.length > 0 ? (
          <ImageGrid>
            {gifs.map(({ id }) => (
              <ImageGridItem
                src={getLink(id)}
                key={id}
                style={{
                  cursor: 'pointer'
                }}
                onClick={() => pickGif(id)}
              />
            ))}
          </ImageGrid>
        ) : (
          <Div style={{ display: 'flex', justifyContent: 'center' }}>
            <Placeholder header="Пустота" icon={<Icon56CompassOutline />}>
              Начните вводить запрос
            </Placeholder>
          </Div>
        )}
      </Group>
    </>
  );
};
