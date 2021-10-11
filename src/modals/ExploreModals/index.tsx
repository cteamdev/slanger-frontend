import type { FC } from 'react';
import { useParams, transition } from '@unexp/router';
import { ModalRoot } from '@vkontakte/vkui';

import { ChooseGifModal } from './ChooseGifModal';

export const ExploreModals: FC = () => {
  const { modal = null } = useParams();

  console.log('modal', modal);

  const close = () => transition(-1);

  return (
    <ModalRoot activeModal={modal} onClose={close}>
      <ChooseGifModal nav="choose-gif" />
    </ModalRoot>
  );
};
