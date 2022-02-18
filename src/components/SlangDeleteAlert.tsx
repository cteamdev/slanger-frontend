import type { FC } from 'react';

import { mutate } from 'swr';
import { useSetAtomState } from '@mntm/precoil';
import { back, useMeta } from '@itznevikat/router';
import { Alert } from '@vkontakte/vkui';

import { snackbarAtom } from '../store';
import { fetcher } from '../utils';
import { DeleteSlangDto, SnackbarIconType } from '../types';

type Props = {
  nav: string;
};

export const SlangDeleteAlert: FC<Props> = ({ nav }: Props) => {
  const { id } = useMeta();

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

    back();
    setSnackbar({ icon: SnackbarIconType.SUCCESS, text: 'Успешно' });
  };

  return (
    <Alert
      id={nav}
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
      onClose={back}
    />
  );
};
