import { send, subscribe, VKBridgeEvent } from '@vkontakte/vk-bridge';

export const init = (): void => {
  subscribe((e: VKBridgeEvent<any>) => {
    switch (e.detail.type) {
      case 'VKWebAppUpdateConfig': {
        const scheme: string = e.detail.data.scheme || 'client_light';
        document.body.setAttribute('scheme', scheme);
        break;
      }
      default:
        return;
    }
  });

  send('VKWebAppInit');
};
