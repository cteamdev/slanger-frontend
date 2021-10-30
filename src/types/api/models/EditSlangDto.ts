/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type EditSlangDto = {
    type?: 'Слово' | 'Словосочетание' | 'Пословица' | 'Фразеологизм';
    themes?: Array<'Сленг' | 'Диалект' | 'Мемы' | 'Игры' | 'Политика' | 'Общество' | 'Интернет' | 'Наука' | 'Спорт' | 'Музыка' | 'Искусство' | 'Религия'>;
    cover?: string;
    word?: string;
    description?: string;
    fromEdition?: boolean;
    id: number;
}
