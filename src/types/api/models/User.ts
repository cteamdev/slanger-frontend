/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Bookmark } from './Bookmark';
import type { Settings } from './Settings';
import type { Slang } from './Slang';
import type { VKInfoDto } from './VKInfoDto';

export type User = {
    id: number;
    points: number;
    rights: string;
    ref: string;
    registration: string;
    dayLimitDate?: string;
    dayLimitCount?: number;
    slangs?: Array<Slang>;
    bookmarks?: Array<Bookmark>;
    settings?: Settings;
    vk: VKInfoDto;
}
