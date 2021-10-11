import type { FC } from 'react';
import { transition } from '@unexp/router';
import { Panel, PanelHeader, PanelHeaderBack } from '@vkontakte/vkui';

import {
  ChooseGif as ChooseGifComponent,
  CustomSnackbar
} from '../../components';

type Props = {
  nav: string;
};

export const ChooseGif: FC<Props> = ({ nav }: Props) => {
  const close = () => transition(-1);

  return (
    <Panel nav={nav}>
      <PanelHeader left={<PanelHeaderBack onClick={close} />} separator={false}>
        Выберите обложку
      </PanelHeader>

      <ChooseGifComponent />

      <CustomSnackbar />
    </Panel>
  );
};
