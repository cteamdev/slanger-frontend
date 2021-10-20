/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type CreateSlangDto = {
    type: 'Слово' | 'Словосочетание' | 'Пословица' | 'Фразеологизм';
    themes: Array<'Слэнг' | 'Мемы' | 'Игры' | 'Политика' | 'Общество' | 'Интернет' | 'Наука' | 'Спорт' | 'Музыка' | 'Искусство' | 'Религия'>;
    cover?: string;
    word: string;
    description: string;
    fromEdition?: boolean;
}
