import type { ReactNode } from 'react';
import type { UserInfo } from '@vkontakte/vk-bridge';

import { atom } from '@mntm/precoil';

import { Snackbar } from './types';

export const snackbarAtom = atom<Snackbar | undefined>(undefined, 'snackbar');
export const rightsAtom = atom<string>('user', 'rights');
export const queryAtom = atom<string>('', 'query');
export const menuVisibilityAtom = atom<boolean>(true, 'menuVisibility');
export const popoutAtom = atom<ReactNode>(null, 'popout');
export const vkUserAtom = atom<UserInfo>({} as UserInfo, 'vkUser');
export const gifAtom = atom<string | null>(null, 'gif');
