import type { FC } from 'react';
import { View } from '@unexp/router';
import {
  Icon28BookmarkOutline,
  Icon28SearchOutline,
  Icon28UserCircleOutline
} from '@vkontakte/icons';
import { useAtomValue } from '@mntm/precoil';

import { Explore, Loading, Slang } from './panels';
import { Modals } from './modals';
import { NavigationLayout } from './components';
import { menuVisibilityAtom } from './store';

export const Layout: FC = () => {
  const menuVisibility: boolean = useAtomValue(menuVisibilityAtom);

  return (
    <NavigationLayout
      buttons={[
        {
          icon: <Icon28BookmarkOutline />,
          story: 'notifications',
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
      ]}
      menuVisibility={menuVisibility}
    >
      <View nav="/">
        <Loading nav="/" />
      </View>

      <View nav="/explore" modal={<Modals />}>
        <Explore nav="/" />
        <Slang nav="/slang" />
      </View>

      {/* TODO: Убрать, это для теста навигации */}
      <View nav="/profile" modal={<Modals />}>
        <Explore nav="/" />
      </View>
    </NavigationLayout>
  );
};
