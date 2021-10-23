import type { FC } from 'react';
import { transition } from '@unexp/router';
import { Panel, PanelHeader, PanelHeaderBack } from '@vkontakte/vkui';

import { ChooseGif as ChooseGifComponent } from '../../components';

type Props = {
  nav: string;
};

export const ChooseGif: FC<Props> = ({ nav }: Props) => {
  const close = () => transition(-1);

  return (
    <Panel nav={nav}>
      <PanelHeader left={<PanelHeaderBack onClick={close} />} separator={false}>
        Обложка
      </PanelHeader>

      <ChooseGifComponent />
    </Panel>
  );
};
