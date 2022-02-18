import type { FC } from 'react';
import { back } from '@itznevikat/router';
import { Panel, PanelHeader, PanelHeaderBack } from '@vkontakte/vkui';

import { ChooseGif as ChooseGifComponent } from '../../components';

type Props = {
  nav: string;
};

export const ChooseGif: FC<Props> = ({ nav }: Props) => {
  return (
    <Panel nav={nav}>
      <PanelHeader left={<PanelHeaderBack onClick={back} />} separator={false}>
        Обложка
      </PanelHeader>

      <ChooseGifComponent />
    </Panel>
  );
};
