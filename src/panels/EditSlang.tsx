import type { FC } from 'react';

import { useAtomState, useSetAtomState } from '@mntm/precoil';
import {
  back,
  push,
  replace,
  useDeserialized,
  useMeta
} from '@itznevikat/router';
import { Group, Panel, PanelHeader, PanelHeaderBack } from '@vkontakte/vkui';

import { EditSlangDto, Slang } from '../types';
import { gifAtom, valuesAtom } from '../store';
import { delay, fetcher } from '../utils';
import { SlangForm } from '../components';
import { Schema, types, voidValues } from '../components/SlangForm';

type Props = {
  nav: string;
};

export const EditSlang: FC<Props> = ({ nav }: Props) => {
  const { view, panel } = useDeserialized();
  const slang: Slang = useMeta();

  const [gif, setGif] = useAtomState(gifAtom);
  const setValues = useSetAtomState(valuesAtom);

  const handleSubmit = async (values: Schema): Promise<void> => {
    const update: Slang = await fetcher('/slangs/edit', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: slang.id,
        cover: gif,
        type: types[values.type - 1],
        word: values.word,
        description: values.description,
        themes: values.themes,
        fromEdition: values.fromEdition
      } as EditSlangDto),
      throw: true
    });
    slang.word = update.word;

    back();
    await delay(250);
    replace(`${view === '/' ? '' : view}/slang`, {
      ad: false,
      ...update
    });

    setGif(null);
    setValues(voidValues);
  };

  return (
    <Panel nav={nav}>
      <PanelHeader
        left={
          <PanelHeaderBack
            onClick={() =>
              push(
                `${
                  view === '/' ? '' : view
                }${panel}?popout=slang-edit-cancel-alert`
              )
            }
          />
        }
      >
        Редактирование
      </PanelHeader>

      <Group>
        <SlangForm mode="edit" handleSubmit={handleSubmit} />
      </Group>
    </Panel>
  );
};
