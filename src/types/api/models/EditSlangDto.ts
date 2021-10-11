/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type EditSlangDto = {
    type?: 'Слово' | 'Словосочетание' | 'Пословица' | 'Фразеологизм';
    cover?: string;
    word?: string;
    description?: string;
    id: number;
}
