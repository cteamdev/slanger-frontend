import type { FC } from 'react';
import { transition } from '@unexp/router';
import {
  ModalPage,
  ModalPageHeader,
  PanelHeaderClose,
  useAdaptivity,
  ViewWidth
} from '@vkontakte/vkui';

import { ChooseGif } from '../components';

type Props = {
  nav: string;
};

export const ChooseGifModal: FC<Props> = ({ nav }: Props) => {
  const { viewWidth } = useAdaptivity();

  const desktop: boolean = (viewWidth ?? 0) >= ViewWidth.SMALL_TABLET;

  const close = () => transition(-1);

  return (
    <ModalPage
      nav={nav}
      onClose={close}
      header={
        <ModalPageHeader
          left={!desktop && <PanelHeaderClose onClick={close} />}
        >
          Выберите обложку
        </ModalPageHeader>
      }
    >
      <ChooseGif />
    </ModalPage>
  );
};
