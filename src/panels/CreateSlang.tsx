import type { FC } from 'react';

import { mutate } from 'swr';
import { useAtomState, useSetAtomState } from '@mntm/precoil';
import { send } from '@vkontakte/vk-bridge';
import { transition } from '@unexp/router';
import { Group, Panel, PanelHeader, PanelHeaderBack } from '@vkontakte/vkui';

import { CreateSlangDto, Slang } from '../types';
import { gifAtom, valuesAtom } from '../store';
import { delay, fetcher } from '../utils';
import { SlangForm } from '../components';
import { Schema, types, voidValues } from '../components/SlangForm';

type Props = {
  nav: string;
};

export const CreateSlang: FC<Props> = ({ nav }: Props) => {
  const [gif, setGif] = useAtomState(gifAtom);
  const setValues = useSetAtomState(valuesAtom);

  const close = async (): Promise<void> => {
    transition(-1);

    await delay(800);
    setGif(null);
    setValues(voidValues);
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
        themes: values.themes,
        fromEdition: values.fromEdition
      } as CreateSlangDto),
      throw: true
    });

    await mutate('/slangs/search');

    transition('/slang', {
      replace: true,
      ...slang
    });

    await delay(800);

    setGif(null);
    setValues(voidValues);

    const { keys } = await send('VKWebAppStorageGet', {
      keys: ['notify-card-date']
    });
    const { value } =
      keys.find((data) => data.key === 'notify-card-date') ?? {};

    if (
      !value ||
      Number.isNaN(Date.parse(value)) ||
      Date.now() - Date.parse(value) > 24 * 60 * 60 * 1000
    ) {
      transition('/slang?modal=notify-card', slang);

      await send('VKWebAppStorageSet', {
        key: 'notify-card-date',
        value: new Date().toString()
      });
    } else {
      await send('VKWebAppShowNativeAds', { ad_format: 'interstitial' });
    }
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
