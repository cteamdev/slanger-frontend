import type { FC } from 'react';
import { Panel, Spinner } from '@vkontakte/vkui';

import { CustomSnackbar } from '../components';

type Props = {
  nav: string;
};

export const Loading: FC<Props> = ({ nav }: Props) => (
  <Panel nav={nav}>
    <Spinner className="Spinner__loader" size="large" />

    <CustomSnackbar />
  </Panel>
);
