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
    themes: Array<'Сленг' | 'Диалект' | 'Мемы' | 'Игры' | 'Политика' | 'Общество' | 'Интернет' | 'Наука' | 'Спорт' | 'Музыка' | 'Искусство' | 'Религия'>;
    status: 'moderating' | 'declined' | 'public';
    date: string;
}
