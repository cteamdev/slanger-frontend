import type { FC } from 'react';
import { transition, useParams, View } from '@unexp/router';
import { ModalRoot, Panel } from '@vkontakte/vkui';
import {
  Icon28BookmarkOutline,
  Icon28SearchOutline,
  Icon28UserCircleOutline
} from '@vkontakte/icons';
import { useAtomValue } from '@mntm/precoil';

import {
  Bookmarks,
  ChooseGif,
  CreateSlang,
  Explore,
  Profile,
  Slang
} from './panels';
import { ChooseGifModal, SettingsModal, ShareSlangModal } from './modals';
import { NavigationLayout } from './components';
import { menuVisibilityAtom } from './store';

export const Layout: FC = () => {
  const { modal = null } = useParams();

  const menuVisibility: boolean = useAtomValue(menuVisibilityAtom);

  return (
    <NavigationLayout
      buttons={[
        {
          icon: <Icon28BookmarkOutline />,
          story: '/bookmarks',
          text: 'Закладки'
        },
        {
          icon: <Icon28SearchOutline />,
          story: '/dictionary',
          text: 'Словарь'
        },
        {
          icon: <Icon28UserCircleOutline />,
          story: '/profile',
          text: 'Профиль'
        }
      ]}
      menuVisibility={menuVisibility}
    >
      {/* Здесь все панели, которые не должны быть во вкладках Epic'а */}
      <View nav="/">
        {/* Пустая панель, отображается, пока сервис думает, куда сделать переход */}
        <Panel nav="/" />

        <Profile nav="/otherProfile" />
      </View>

      <View
        nav="/dictionary"
        modal={
          <ModalRoot activeModal={modal} onClose={() => transition(-1)}>
            <ChooseGifModal nav="choose-gif" />
            <ShareSlangModal nav="share-slang" />
          </ModalRoot>
        }
      >
        <Explore nav="/" />
        <Slang nav="/slang" />
        <Profile nav="/otherProfile" />
        <CreateSlang nav="/create" />
        <ChooseGif nav="/choose-gif" />
      </View>

      <View nav="/bookmarks">
        <Bookmarks nav="/" />
        <Slang nav="/slang" />
      </View>

      <View
        nav="/profile"
        modal={
          <ModalRoot activeModal={modal} onClose={() => transition(-1)}>
            <SettingsModal nav="settings" />
          </ModalRoot>
        }
      >
        <Profile nav="/" />
      </View>
    </NavigationLayout>
  );
};
