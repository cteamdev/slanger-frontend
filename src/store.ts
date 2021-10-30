import type { UserInfo } from '@vkontakte/vk-bridge';

import { atom } from '@mntm/precoil';

import { Snackbar } from './types';
import { Schema } from './components/SlangForm';

export const snackbarAtom = atom<Snackbar | undefined>(undefined, 'snackbar');
export const rightsAtom = atom<string>('user', 'rights');
export const queryAtom = atom<string>('', 'query');
export const vkUserAtom = atom<UserInfo>({} as UserInfo, 'vkUser');

export const menuVisibilityAtom = atom<boolean>(true, 'menuVisibility');
export const disabledAtom = atom<boolean>(false, 'disabled');

export const valuesAtom = atom<Schema>(
  {
    type: 0,
    word: '',
    description: '',
    themes: [],
    fromEdition: false
  },
  'values'
);
export const gifAtom = atom<string | null>(null, 'gif');
