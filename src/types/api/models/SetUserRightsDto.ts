/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type SetUserRightsDto = {
    id: number;
    rights: 'user' | 'banned' | 'moderator' | 'admin';
}
