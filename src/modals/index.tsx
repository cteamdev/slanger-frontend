import type { FC } from 'react';
import { useParams, transition } from '@unexp/router';
import { ModalRoot } from '@vkontakte/vkui';

import { HelloWorldModal } from './HelloWorld';

export const Modals: FC = () => {
  const { modal = null } = useParams();

  console.log('modal', modal);

  const close = () => transition(-1);

  return (
    <ModalRoot activeModal={modal} onClose={close}>
      <HelloWorldModal id="hello-world" nav="hello-world" />
    </ModalRoot>
  );
};
