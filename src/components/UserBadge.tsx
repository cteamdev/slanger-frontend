import type { FC } from 'react';
import {
  Icon12EyeSlashOutline,
  Icon12Stars,
  Icon12Verified
} from '@vkontakte/icons';

type Props = {
  verified: boolean | undefined;
  rights: string | undefined;
};

export const UserBadge: FC<Props> = ({ verified, rights }: Props) =>
  verified ? (
    <Icon12Verified style={{ color: 'var(--accent)' }} />
  ) : ['admin', 'moderator'].includes(rights || '') ? (
    <Icon12Stars style={{ color: 'var(--accent)' }} />
  ) : rights === 'banned' ? (
    <Icon12EyeSlashOutline style={{ color: 'var(--accent)' }} />
  ) : null;
