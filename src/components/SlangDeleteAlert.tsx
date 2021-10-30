import type { FC } from 'react';

import { mutate } from 'swr';
import { useSetAtomState } from '@mntm/precoil';
import { transition, useHistoryState } from '@unexp/router';
import { Alert } from '@vkontakte/vkui';

import { snackbarAtom } from '../store';
import { fetcher } from '../utils';
import { DeleteSlangDto, SnackbarIconType } from '../types';

export const SlangDeleteAlert: FC = () => {
  const { id } = useHistoryState();

  const setSnackbar = useSetAtomState(snackbarAtom);

  const action = async (): Promise<void> => {
    await fetcher('/slangs/delete', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: parseInt(id) } as DeleteSlangDto),
      throw: true
    });

    await mutate('/slangs/search');
    await mutate('/slangs/getOwn');

    transition(-1);
    setSnackbar({ icon: SnackbarIconType.SUCCESS, text: 'Успешно' });
  };

  return (
    <Alert
      header="Подтверждение"
      text="Вы действительно хотите удалить этот сленг? Отменить действие невозможно."
      actionsLayout="vertical"
      actions={[
        {
          title: 'Удалить',
          mode: 'destructive',
          autoclose: true,
          action
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
