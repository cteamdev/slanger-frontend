import './ChooseGif.css';

import type { ChangeEvent, FC } from 'react';
import type { GifsResult } from '@giphy/js-fetch-api';
import { useRef, useState } from 'react';
import { Caption, Group, Search as VKUISearch } from '@vkontakte/vkui';
import { useSetAtomState } from '@mntm/precoil';
import { transition } from '@unexp/router';

import { gifAtom } from '../../store';
import { giphy } from '../../utils';

import { ImageGrid, ImageGridItem } from '../ImageGrid';

export const ChooseGif: FC = () => {
  const [searchValue, setSearchValue] = useState<string>('');
  const [gifs, setGifs] = useState<GifsResult['data']>([]);
  const searchTimeout = useRef<number | undefined>();
  const setGif = useSetAtomState(gifAtom);

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

  const pickGif = (id: string | number) => {
    setGif(String(id));
    close();
  };

  return (
    <>
      <VKUISearch value={searchValue} onChange={onSearchChange} />
      <Group separator="hide">
        <Caption level="1" weight="regular" className="OurCaption">
          Обложки представлены сервисом{' '}
          <a href="https://giphy.com" target="_blank">
            Giphy.com
          </a>
        </Caption>
      </Group>
      <Group>
        <ImageGrid>
          {gifs.length > 0 ? (
            gifs.map((gif) => (
              <ImageGridItem
                src={`https://media1.giphy.com/media/${gif.id}/giphy.gif`}
                key={gif.id}
                onClick={() => pickGif(gif.id)}
              />
            ))
          ) : (
            <></>
          )}
        </ImageGrid>
      </Group>
    </>
  );
};
