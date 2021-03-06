import type { CSSProperties, FC } from 'react';

import useSWR from 'swr';
import { useRef } from 'react';
import { back, replace } from '@itznevikat/router';
import {
  CellButton,
  Checkbox,
  Group,
  Header,
  ModalPage,
  ModalPageHeader,
  PanelHeaderClose,
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
import {
  Icon28ClearDataOutline,
  Icon28UserOutgoingOutline
} from '@vkontakte/icons';

import { useAdaptivity } from '../hooks';
import { delay, fetcher } from '../utils';
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

  const clearStorage = async (): Promise<void> => {
    const { keys = [] } = await send('VKWebAppStorageGetKeys', {
      count: 100,
      offset: 0
    });
    for (const i in keys) {
      await send('VKWebAppStorageSet', { key: keys[i], value: '' });
      await new Promise((resolve) => setTimeout(resolve, 250));
    }

    back();
    await delay(400);
    setSnackbar({
      icon: SnackbarIconType.SUCCESS,
      text: 'VK Storage ?????????????? ????????????'
    });
  };

  const go = async (): Promise<void> => {
    back();
    await delay(800);
    replace('/onboarding');
  };

  return (
    <ModalPage
      nav={nav}
      onClose={back}
      header={
        <ModalPageHeader left={!desktop && <PanelHeaderClose onClick={back} />}>
          ??????????????????
        </ModalPageHeader>
      }
    >
      <Group
        header={
          <Header subtitle="????????????????, ???? ???????????????? ??????????????????">
            ??????????????????????
          </Header>
        }
        mode="plain"
      >
        {data ? (
          <>
            <Checkbox checked={push} onClick={() => switchNotify('push')}>
              ???? ????????-????????????????????
            </Checkbox>
            <Checkbox checked={im} onClick={() => switchNotify('im')}>
              ???? ????????????????????
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
        <CellButton before={<Icon28UserOutgoingOutline />} onClick={go}>
          ?????????????? ?? ????????????????????
        </CellButton>
        <CellButton before={<Icon28ClearDataOutline />} onClick={clearStorage}>
          ???????????????? VK Storage
        </CellButton>
      </Group>
    </ModalPage>
  );
};
