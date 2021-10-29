import '@vkontakte/vkui/dist/vkui.css';
import '@vkontakte/vkui/dist/unstable.css';
import './styles.css';
import './colors.css';

// Сразу подгружаем первую картинку в онбоардинге
import '/avatar.png';

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
import { transition } from '@unexp/router';

import { vkUserAtom } from './store';
import { fetcher } from './utils';

import { Layout } from './Layout';
import { delay } from './utils';

export const App: FC = () => {
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

  const setVkUser = useSetAtomState(vkUserAtom);

  useEffect(() => {
    const load = async (): Promise<void> => {
      // Сначала запишем данные, а то роутер стирает их
      const hash: string = window.location.hash.slice(1);

      // Чтобы пользователь не смотрел на пустой экран, пока грузится
      transition('/', { replace: true });

      // Пока получим юзера
      const vkUser: UserInfo = await send('VKWebAppGetUserInfo');
      setVkUser(vkUser);

      // Задержка: анти-мелькание
      await delay(800);

      // Онбоардинг
      const { keys } = await send('VKWebAppStorageGet', {
        keys: ['onboarding']
      });
      if (
        !keys.some((data) => data.key === 'onboarding' && data.value === 'true')
      )
        transition('/onboarding', { replace: true });

      const [page, paramsString]: string[] = hash.split('?');
      const params: URLSearchParams | null = paramsString
        ? new URLSearchParams(paramsString)
        : null;
      const id: string | null = params && params.get('id');

      if (page === 'slang' && id)
        transition('/slang', {
          slangId: +id
        });
      else if (page === 'profile' && id)
        transition('/otherProfile', {
          userId: +id,
          backButton: true
        });
    };

    load();
  }, []);

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
