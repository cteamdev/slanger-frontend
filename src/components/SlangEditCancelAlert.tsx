import type { FC } from 'react';

import { transition } from '@unexp/router';
import { Alert } from '@vkontakte/vkui';

export const SlangEditCancelAlert: FC = () => {
  return (
    <Alert
      header="Отменить изменения"
      text="Вы действительно хотите отменить изменения и вернуться назад?"
      actionsLayout="vertical"
      actions={[
        {
          title: 'Назад',
          mode: 'destructive',
          autoclose: true,
          action: () => setTimeout(() => transition(-1), 250)
        },
        {
          title: 'Отмена',
          mode: 'cancel',
          autoclose: true
        }
      ]}
      onClose={() => transition(-1)}
    />
  );
};
