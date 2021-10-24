import { send, subscribe, VKBridgeEvent } from '@vkontakte/vk-bridge';

export const init = (): void => {
  const root: HTMLElement = document.getElementById('root')!;
  root.style.opacity = '0';

  subscribe((e: VKBridgeEvent<any>) => {
    switch (e.detail.type) {
      case 'VKWebAppUpdateConfig': {
        const scheme: string = e.detail.data.scheme || 'client_light';
        document.body.setAttribute('scheme', scheme);

        root.style.opacity = '1';

        break;
      }
      default:
        return;
    }
  });
  send('VKWebAppInit');
};
