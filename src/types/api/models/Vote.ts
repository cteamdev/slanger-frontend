/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Slang } from './Slang';
import type { User } from './User';

export type Vote = {
    id: number;
    user: User;
    slang: Slang;
    type: string;
}
