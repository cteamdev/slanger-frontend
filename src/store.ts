import { atom } from '@mntm/precoil';
import { UserInfo } from '@vkontakte/vk-bridge';

import { Snackbar } from './types';

export const snackbarAtom = atom<Snackbar | undefined>(undefined, 'snackbar');
export const rightsAtom = atom<string>('user', 'tights');
export const menuVisibilityAtom = atom<boolean>(true, 'menuVisibility');
export const vkUserAtom = atom<UserInfo>({} as UserInfo, 'vkUser');
export const gifAtom = atom<string | null>(null, 'gif');
