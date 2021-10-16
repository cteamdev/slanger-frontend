import type { FC } from 'react';
import { transition } from '@unexp/router';
import { ModalPage, ModalPageHeader } from '@vkontakte/vkui';

import { ChooseGif } from '../components';

type Props = {
  nav: string;
};

export const ChooseGifModal: FC<Props> = ({ nav }: Props) => (
  <ModalPage
    nav={nav}
    onClose={() => transition(-1)}
    header={<ModalPageHeader>Выберите обложку</ModalPageHeader>}
  >
    <ChooseGif />
  </ModalPage>
);
