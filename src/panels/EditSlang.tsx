import type { FC } from 'react';

import { mutate } from 'swr';
import { useAtomState } from '@mntm/precoil';
import {
  transition,
  useDeserializedLocation,
  useHistoryState
} from '@unexp/router';
import { Group, Panel, PanelHeader, PanelHeaderBack } from '@vkontakte/vkui';

import { EditSlangDto, Slang } from '../types';
import { gifAtom } from '../store';
import { delay, fetcher } from '../utils';
import { SlangForm } from '../components';
import { Schema, types } from '../components/SlangForm';

type Props = {
  nav: string;
};

export const EditSlang: FC<Props> = ({ nav }: Props) => {
  const { view } = useDeserializedLocation();
  const slang: Slang = useHistoryState();

  const [gif, setGif] = useAtomState(gifAtom);

  const close = (): void => {
    setGif(null);
    transition(-1);
  };

  const handleSubmit = async (values: Schema): Promise<void> => {
    const update: Slang = await fetcher('/slangs/edit', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: slang.id,
        type: types[values.type - 1],
        word: values.word,
        description: values.description,
        cover: gif
      } as EditSlangDto),
      throw: true
    });
    slang.word = update.word;

    await mutate('/slangs/search');

    transition(-1);
    await delay(200);
    transition(`${view}/slang`, {
      replace: true,
      ...update
    });
  };

  return (
    <Panel nav={nav}>
      <PanelHeader left={<PanelHeaderBack onClick={close} />}>
        Редактирование
      </PanelHeader>

      <Group>
        <SlangForm
          mode="edit"
          initialValues={{
            type: types.indexOf(slang.type) + 1,
            word: slang.word,
            description: slang.description
          }}
          handleSubmit={handleSubmit}
        />
      </Group>
    </Panel>
  );
};
