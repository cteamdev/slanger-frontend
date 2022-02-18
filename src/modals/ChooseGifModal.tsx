import type { FC } from 'react';
import { back } from '@itznevikat/router';
import { ModalPage, ModalPageHeader } from '@vkontakte/vkui';

import { ChooseGif } from '../components';

type Props = {
  nav: string;
};

export const ChooseGifModal: FC<Props> = ({ nav }: Props) => (
  <ModalPage
    nav={nav}
    onClose={back}
    header={<ModalPageHeader>Выберите обложку</ModalPageHeader>}
  >
    <ChooseGif />
  </ModalPage>
);
