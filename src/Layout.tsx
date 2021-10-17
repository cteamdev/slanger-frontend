import type { FC, ReactNode } from 'react';
import { useAtomValue } from '@mntm/precoil';
import { transition, useParams, View } from '@unexp/router';
import { ModalRoot, Panel } from '@vkontakte/vkui';
import {
  Icon28BookmarkOutline,
  Icon28BugOutline,
  Icon28SearchOutline,
  Icon28UserCircleOutline
} from '@vkontakte/icons';

import {
  AdminExplore,
  Bookmarks,
  ChooseGif,
  CreateSlang,
  EditSlang,
  Explore,
  Onboarding,
  OwnSlangs,
  Profile,
  Slang
} from './panels';
import {
  ChooseGifModal,
  NotifyModalCard,
  SettingsModal,
  ShareSlangModal
} from './modals';
import { NavigationLayout } from './components';
import { menuVisibilityAtom, popoutAtom, rightsAtom } from './store';

export const Layout: FC = () => {
  const { modal = null } = useParams();

  const popout: ReactNode = useAtomValue(popoutAtom);
  const menuVisibility: boolean = useAtomValue(menuVisibilityAtom);
  const rights: string = useAtomValue(rightsAtom);

  return (
    <NavigationLayout
      modal={
        <ModalRoot activeModal={modal} onClose={() => transition(-1)}>
          <ChooseGifModal nav="choose-gif" />
          <ShareSlangModal nav="share-slang" />
          <NotifyModalCard nav="notify-card" />
          <SettingsModal nav="settings" />
        </ModalRoot>
      }
      popout={popout}
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
        },
        ['moderator', 'admin'].includes(rights) && {
          icon: <Icon28BugOutline />,
          story: '/admin',
          text: 'Модерация'
        }
      ]}
      menuVisibility={menuVisibility}
    >
      {/* Здесь все панели, которые не должны быть во вкладках Epic'а */}
      <View nav="/">
        {/* Пустая панель, отображается, пока сервис думает, куда сделать переход */}
        <Panel nav="/" />

        <Onboarding nav="/onboarding" />
      </View>

      <View nav="/dictionary">
        <Explore nav="/" />
        <Slang nav="/slang" />
        <EditSlang nav="/editSlang" />
        <Profile nav="/otherProfile" />
        <CreateSlang nav="/create" />
        <ChooseGif nav="/choose-gif" />
      </View>

      <View nav="/bookmarks">
        <Bookmarks nav="/" />
        <Slang nav="/slang" />
        <EditSlang nav="/editSlang" />
      </View>

      <View nav="/profile">
        <Profile nav="/" />
        <Profile nav="/otherProfile" />
        <OwnSlangs nav="/ownSlangs" />
        <Slang nav="/slang" />
        <EditSlang nav="/editSlang" />
      </View>

      <View nav="/admin">
        <AdminExplore nav="/" />
        <Slang nav="/slang" />
        <EditSlang nav="/editSlang" />
        <Profile nav="/otherProfile" />
      </View>
    </NavigationLayout>
  );
};
