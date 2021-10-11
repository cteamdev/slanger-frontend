/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { User } from './User';

export type Slang = {
    id: number;
    user?: User;
    type: 'Слово' | 'Словосочетание' | 'Пословица' | 'Фразеологизм';
    cover?: string;
    word: string;
    description: string;
    votes: number;
    status: 'moderating' | 'declined' | 'public';
    date: string;
}
