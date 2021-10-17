import type { FC } from 'react';

import { mutate } from 'swr';
import { useSetAtomState } from '@mntm/precoil';
import { transition, useHistoryState } from '@unexp/router';
import { Alert } from '@vkontakte/vkui';

import { popoutAtom, snackbarAtom } from '../store';
import { fetcher } from '../utils';
import { DeleteSlangDto, SnackbarIconType } from '../types';

export const SlangDeleteAlert: FC = () => {
  const { id } = useHistoryState();

  const setPopout = useSetAtomState(popoutAtom);
  const setSnackbar = useSetAtomState(snackbarAtom);

  const action = async (): Promise<void> => {
    await fetcher('/slangs/delete', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id } as DeleteSlangDto),
      throw: true
    });

    await mutate('/slangs/search');
    await mutate('/slangs/getOwn');

    transition(-1);
    setSnackbar({ icon: SnackbarIconType.SUCCESS, text: 'Успех' });
  };

  return (
    <Alert
      header="Подтверждение"
      text="Вы действительно хотите удалить этот слэнг? Отменить действие невозможно."
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
      onClose={() => setPopout(null)}
    />
  );
};