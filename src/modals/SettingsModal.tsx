import type { CSSProperties, FC } from 'react';

import useSWR from 'swr';
import { useRef } from 'react';
import { transition } from '@unexp/router';
import {
  CellButton,
  Checkbox,
  Group,
  Header,
  ModalPage,
  ModalPageHeader,
  PanelHeaderClose,
  useAdaptivity,
  ViewWidth
} from '@vkontakte/vkui';
import { send } from '@vkontakte/vk-bridge';
import { useAtomValue, useSetAtomState } from '@mntm/precoil';
import { snackbarAtom, vkUserAtom } from '../store';
import {
  ResponseError,
  SetSettingsDto,
  SnackbarIconType,
  User
} from '../types';
import { Icon28ClearDataOutline } from '@vkontakte/icons';
import { fetcher } from '../utils';
import { Skeleton } from '../components';

type Props = {
  nav: string;
};

export const SettingsModal: FC<Props> = ({ nav }: Props) => {
  const { viewWidth } = useAdaptivity();

  const { id } = useAtomValue(vkUserAtom);
  const loading = useRef<boolean>(false);

  const { data, error, mutate } = useSWR<User, ResponseError>(
    id ? `/users/getById?id=${id}` : null,
    fetcher
  );
  const { push, im } = data?.settings ?? {};

  const setSnackbar = useSetAtomState(snackbarAtom);

  const desktop: boolean = (viewWidth ?? 0) >= ViewWidth.SMALL_TABLET;
  const style: CSSProperties = {
    height: 36
  };

  const close = (): void => transition(-1);

  const switchNotify = async (type: keyof SetSettingsDto): Promise<void> => {
    if (loading.current) return;
    loading.current = true;

    if (type === 'push' && !push) {
      try {
        await send('VKWebAppAllowNotifications');
      } catch {
        loading.current = false;
        return;
      }
    } else if (type === 'im' && !im) {
      try {
        await send('VKWebAppAllowMessagesFromGroup', {
          group_id: 207745347
        });
      } catch {
        loading.current = false;
        return;
      }
    }

    const user: User = await fetcher('/users/setSettings', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(
        (type === 'push'
          ? { push: !push, im }
          : { push, im: !im }) as SetSettingsDto
      ),
      throw: true
    });
    await mutate(user, false);

    loading.current = false;
  };

  const clearStorage = async () => {
    const { keys = [] } = await send('VKWebAppStorageGetKeys', {
      count: 100,
      offset: 0
    });
    for (const i in keys) {
      await send('VKWebAppStorageSet', { key: keys[i], value: '' });
      await new Promise((resolve) => setTimeout(resolve, 250));
    }

    setSnackbar({
      icon: SnackbarIconType.SUCCESS,
      text: 'VK Storage успешно очищен'
    });
  };

  return (
    <ModalPage
      nav={nav}
      onClose={close}
      header={
        <ModalPageHeader
          left={!desktop && <PanelHeaderClose onClick={close} />}
        >
          Настройки
        </ModalPageHeader>
      }
    >
      <Group
        header={
          <Header subtitle="Например, об успешной модерации">
            Уведомления
          </Header>
        }
        mode="plain"
      >
        {data ? (
          <>
            <Checkbox checked={push} onClick={() => switchNotify('push')}>
              От мини-приложения
            </Checkbox>
            <Checkbox checked={im} onClick={() => switchNotify('im')}>
              От сообщества
            </Checkbox>
          </>
        ) : (
          !error && (
            <>
              <Skeleton style={style} />
              <Skeleton style={style} />
            </>
          )
        )}
      </Group>

      <Group>
        <CellButton onClick={clearStorage} before={<Icon28ClearDataOutline />}>
          Очистить VK Storage
        </CellButton>
      </Group>
    </ModalPage>
  );
};
