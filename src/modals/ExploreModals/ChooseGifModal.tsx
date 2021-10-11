import './ChooseGifModal.css';

import type { ChangeEvent, FC } from 'react';
import { useRef, useState } from 'react';
import { transition } from '@unexp/router';
import {
  Caption,
  Group,
  ModalPage,
  ModalPageHeader,
  PanelHeaderClose,
  Search as VKUISearch,
  useAdaptivity,
  ViewWidth
} from '@vkontakte/vkui';

import { giphy } from '../../utils';
import { ImageGrid, ImageGridItem, Skeleton } from '../../components';
import { GifsResult } from '@giphy/js-fetch-api';

type Props = {
  nav: string;
};

export const ChooseGifModal: FC<Props> = (props: Props) => {
  const [searchValue, setSearchValue] = useState<string>('');
  const searchTimeout = useRef<number | undefined>();
  const [gifs, setGifs] = useState<GifsResult['data']>([]);
  const { viewWidth } = useAdaptivity();

  const desktop: boolean = (viewWidth ?? 0) >= ViewWidth.SMALL_TABLET;

  const close = () => transition(-1);
  const onSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);

    searchTimeout.current = setTimeout(() => {
      console.log(e.target.value);
      if (e.target.value.trim().length > 0)
        giphy
          .search(e.target.value, { limit: 10, sort: 'relevant', type: 'gifs' })
          .then((gifs) => {
            console.log(gifs);
            setGifs(gifs.data);
          });
    }, 1000);
  };

  return (
    <ModalPage
      nav={props.nav}
      onClose={close}
      header={
        <ModalPageHeader
          left={!desktop && <PanelHeaderClose onClick={close} />}
        >
          Выберите обложку
        </ModalPageHeader>
      }
    >
      <Group separator="hide">
        <Caption level="1" weight="regular" className="OurCaption">
          Обложки представлены сервисом{' '}
          <a href="https://giphy.com" target="_blank">
            Giphy.com
          </a>
        </Caption>
      </Group>
      <Group>
        <VKUISearch value={searchValue} onChange={onSearchChange} />
      </Group>
      <Group>
        <ImageGrid>
          {gifs.length > 0 ? (
            gifs.map((gif) => (
              <ImageGridItem
                src={`https://media1.giphy.com/media/${gif.id}/giphy.gif`}
              />
            ))
          ) : (
            <>
              <Skeleton height={96} />
              <Skeleton height={96} />
              <Skeleton height={96} />
              <Skeleton height={96} />
            </>
          )}
        </ImageGrid>
      </Group>
    </ModalPage>
  );
};
