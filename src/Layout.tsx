import type { FC } from 'react';
import { View } from '@unexp/router';
import {
  Icon28BookmarkOutline,
  Icon28SearchOutline,
  Icon28UserCircleOutline
} from '@vkontakte/icons';
import { useAtomValue } from '@mntm/precoil';

import { CreateSlang, Explore, Loading, Slang } from './panels';
import { ExploreModals } from './modals';
import { NavigationLayout } from './components';
import { menuVisibilityAtom } from './store';
import { NavigationButton } from './types';

export const Layout: FC = () => {
  const menuVisibility: boolean = useAtomValue(menuVisibilityAtom);

  const buttons: NavigationButton[] = [
    {
      icon: <Icon28BookmarkOutline />,
      story: 'favorites',
      text: 'Закладки'
    },
    {
      icon: <Icon28SearchOutline />,
      story: 'explore',
      text: 'Словарь'
    },
    {
      icon: <Icon28UserCircleOutline />,
      story: 'profile',
      text: 'Профиль'
    }
  ];

  return (
    <NavigationLayout buttons={buttons} menuVisibility={menuVisibility}>
      <View nav="/">
        <Loading nav="/" />
      </View>

      <View nav="/explore" modal={<ExploreModals />}>
        <Explore nav="/" />
        <Slang nav="/slang" />
        <CreateSlang nav="/create" />
      </View>

      {/* TODO: Убрать, это для теста навигации */}
      <View nav="/profile">
        <Explore nav="/" />
      </View>
    </NavigationLayout>
  );
};
