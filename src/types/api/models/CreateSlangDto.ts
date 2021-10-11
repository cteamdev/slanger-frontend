/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type CreateSlangDto = {
    type: 'Слово' | 'Словосочетание' | 'Пословица' | 'Фразеологизм';
    cover?: string;
    word: string;
    description: string;
}
