import type { FC } from 'react';

import { mutate } from 'swr';
import { useAtomState } from '@mntm/precoil';
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
        type: types[values.type - 1],
        word: values.word,
        description: values.description,
        cover: gif
      } as CreateSlangDto),
      throw: true
    });

    await mutate('/slangs/search');
    setTimeout(
      () => transition('/dictionary/slang?modal=notify-card', slang),
      800
    );
    transition('/dictionary/slang', {
      replace: true,
      ...slang
    });
  };

  return (
    <Panel nav={nav}>
      <PanelHeader left={<PanelHeaderBack onClick={close} />}>
        Новое выражение
      </PanelHeader>

      <Group>
        <SlangForm mode="create" handleSubmit={handleSubmit} />
      </Group>
    </Panel>
  );
};
