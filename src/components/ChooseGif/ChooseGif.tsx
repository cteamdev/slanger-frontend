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
  Link,
  Placeholder,
  Search as VKUISearch,
  Spinner
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
    <Link
      href="https://giphy.com"
      target="_blank"
      style={{ color: 'inherit', textDecorationLine: 'underline' }}
    >
      Giphy.com
    </Link>
  </Caption>
);

export const ChooseGif: FC = () => {
  const [searchValue, setSearchValue] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [gifs, setGifs] = useState<GifsResult['data']>([]);

  const searchTimeout = useRef<number | undefined>();

  const [gif, setGif] = useAtomState(gifAtom);

  const onSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);

    if (searchTimeout.current) clearTimeout(searchTimeout.current);

    searchTimeout.current = setTimeout(() => {
      setGifs([]);
      setLoading(true);
      giphy
        .search(e.target.value, { limit: 10, sort: 'relevant', type: 'gifs' })
        .then((gifs) => setGifs(gifs.data))
        .then(() => setLoading(false));
    }, 400);
  };

  const getLink = (id: string | number): string =>
    `https://media1.giphy.com/media/${id}/giphy.gif`;

  const pickGif = async (id: string | number): Promise<void> => {
    transition(-1);
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
        ) : loading ? (
          <Spinner />
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
