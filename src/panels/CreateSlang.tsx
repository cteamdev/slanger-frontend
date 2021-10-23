import type { FC } from 'react';

import { mutate } from 'swr';
import { useAtomState } from '@mntm/precoil';
import { send } from '@vkontakte/vk-bridge';
import { transition } from '@unexp/router';
import { Group, Panel, PanelHeader, PanelHeaderBack } from '@vkontakte/vkui';

import { CreateSlangDto, Slang } from '../types';
import { gifAtom } from '../store';
import { fetcher } from '../utils';
import { SlangForm } from '../components';
import { Schema, types } from '../components/SlangForm';

type Props = {
  nav: string;
};

export const CreateSlang: FC<Props> = ({ nav }: Props) => {
  const [gif, setGif] = useAtomState(gifAtom);

  const close = (): void => {
    setGif(null);
    transition(-1);
  };

  const handleSubmit = async (values: Schema): Promise<void> => {
    const slang: Slang = await fetcher('/slangs/create', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cover: gif,
        type: types[values.type - 1],
        word: values.word,
        description: values.description,
        themes: values.themes.map((option) => option.value),
        fromEdition: values.fromEdition
      } as CreateSlangDto),
      throw: true
    });

    await mutate('/slangs/search');

    transition('/dictionary/slang', {
      replace: true,
      ...slang
    });
    setGif(null);

    const { keys } = await send('VKWebAppStorageGet', {
      keys: ['notify-card-date']
    });
    if (
      !keys.some((data) => data.key === 'notify-card-date') ||
      keys.some(
        (data) =>
          data.key === 'notify-card-date' &&
          Date.now() - Date.parse(data.value) > 24 * 60 * 60 * 1000
      )
    ) {
      setTimeout(
        () => transition('/dictionary/slang?modal=notify-card', slang),
        800
      );
    } else {
      await send('VKWebAppShowNativeAds', { ad_format: 'interstitial' });
    }

    await send('VKWebAppStorageSet', {
      key: 'notify-card-date',
      value: new Date().toString()
    });
  };

  return (
    <Panel nav={nav}>
      <PanelHeader left={<PanelHeaderBack onClick={close} />}>
        Создание
      </PanelHeader>

      <Group>
        <SlangForm mode="create" handleSubmit={handleSubmit} />
      </Group>
    </Panel>
  );
};
