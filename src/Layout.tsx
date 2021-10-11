import type { FC } from 'react';
import { View } from '@unexp/router';
import {
  Icon28BookmarkOutline,
  Icon28SearchOutline,
  Icon28UserCircleOutline
} from '@vkontakte/icons';
import { useAtomValue } from '@mntm/precoil';

import { ChooseGif, CreateSlang, Explore, Slang } from './panels';
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
      <View nav="/" modal={<ExploreModals />}>
        <Explore nav="/explore" />
        <Slang nav="/slang" />
        <CreateSlang nav="/create" />
        <ChooseGif nav="/choose-gif" />
      </View>

      {/* TODO: Убрать, это для теста навигации */}
      <View nav="/profile">
        <Explore nav="/" />
      </View>
    </NavigationLayout>
  );
};
