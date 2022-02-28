import type { FC } from 'react';

import { back } from '@itznevikat/router';
import { Alert } from '@vkontakte/vkui';

type Props = {
  nav: string;
};

export const SlangEditCancelAlert: FC<Props> = ({ nav }: Props) => {
  return (
    <Alert
      id={nav}
      header="Отменить изменения"
      text="Вы действительно хотите отменить изменения и вернуться назад?"
      actionsLayout="vertical"
      actions={[
        {
          title: 'Назад',
          mode: 'destructive',
          autoclose: true,
          action: () => setTimeout(back, 250)
        },
        {
          title: 'Отмена',
          mode: 'cancel',
          autoclose: true
        }
      ]}
      onClose={back}
    />
  );
};
