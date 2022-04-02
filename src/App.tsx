import '@vkontakte/vkui/dist/vkui.css';
import './styles.css';

import { FC, useEffect } from 'react';
import { send } from '@vkontakte/vk-bridge';
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

import { Layout } from './Layout';

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

  useEffect(() => {
    const logo: HTMLImageElement = new Image();
    logo.src = '/avatar.png';
    logo.onload = () => send('VKWebAppInit');
  }, []);

  return (
    <ConfigProvider
      platform={platform}
      isWebView={true}
      webviewType={
        platform === VKCOM ? WebviewType.INTERNAL : WebviewType.VKAPPS
      }
    >
      <AdaptivityProvider>
        <AppRoot>
          <Layout />
        </AppRoot>
      </AdaptivityProvider>
    </ConfigProvider>
  );
};
