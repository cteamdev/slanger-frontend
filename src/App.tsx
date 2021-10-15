import '@vkontakte/vkui/dist/vkui.css';
import './styles.css';
import './colors.css';

import type { FC } from 'react';
import { useEffect } from 'react';
import { SWRConfig } from 'swr';
import { useSetAtomState } from '@mntm/precoil';
import { send, UserInfo } from '@vkontakte/vk-bridge';
import {
  AdaptivityProvider,
  ANDROID,
  AppRoot,
  ConfigProvider,
  IOS,
  PlatformType,
  VKCOM,
  WebviewType
} from '@vkontakte/vkui';
import { transition, useLocation } from '@unexp/router';

import { snackbarAtom, vkUserAtom } from './store';
import { fetcher, useUpdateEffect } from './utils';

import { Layout } from './Layout';

export const App: FC = () => {
  const { pathname } = useLocation();

  const platformParam: string | null = new URLSearchParams(
    window.location.search
  ).get('vk_platform');
  const platform: PlatformType =
    (platformParam && platformParam.includes('iphone')) ||
    (platformParam && platformParam.includes('mobile_web'))
      ? IOS
      : platformParam && platformParam.includes('android')
      ? ANDROID
      : VKCOM;

  const setSnackbar = useSetAtomState(snackbarAtom);
  const setVkUser = useSetAtomState(vkUserAtom);

  useEffect(() => {
    const load = async (): Promise<void> => {
      transition('/dictionary', { replace: true });
      // transition('/otherProfile?id=435214391', { replace: true });

      const vkUser: UserInfo = await send('VKWebAppGetUserInfo');
      setVkUser(vkUser);
    };

    load();
  }, []);

  useUpdateEffect(() => {
    setSnackbar(undefined);
  }, [pathname]);

  return (
    <ConfigProvider
      platform={platform}
      isWebView={true}
      webviewType={WebviewType.INTERNAL}
    >
      <SWRConfig
        value={{
          fetcher,
          provider: () => new Map()
        }}
      >
        <AdaptivityProvider>
          <AppRoot>
            <Layout />
          </AppRoot>
        </AdaptivityProvider>
      </SWRConfig>
    </ConfigProvider>
  );
};
