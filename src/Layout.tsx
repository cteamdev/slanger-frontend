import type { FC } from 'react';
import { useAtomValue } from '@mntm/precoil';
import { transition, useParams, View } from '@unexp/router';
import { ModalRoot } from '@vkontakte/vkui';
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
import { NavigationLayout, SlangDeleteAlert } from './components';
import { menuVisibilityAtom, rightsAtom } from './store';

export const Layout: FC = () => {
  const { modal = null, popout = null } = useParams();

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
      popout={
        popout
          ? {
              'slang-delete-alert': <SlangDeleteAlert />
            }[popout]
          : null
      }
      buttons={[
        {
          icon: <Icon28BookmarkOutline />,
          story: '/bookmarks',
          text: 'Закладки'
        },
        {
          icon: <Icon28SearchOutline />,
          story: '/',
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
      <View nav="/onboarding">
        <Onboarding nav="/" />
      </View>

      <View nav="/">
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
        <ChooseGif nav="/choose-gif" />
        <Profile nav="/otherProfile" />
        <OwnSlangs nav="/ownSlangs" />
      </View>

      <View nav="/profile">
        <Profile nav="/" />
        <Profile nav="/otherProfile" />
        <OwnSlangs nav="/ownSlangs" />
        <Slang nav="/slang" />
        <EditSlang nav="/editSlang" />
        <ChooseGif nav="/choose-gif" />
      </View>

      <View nav="/admin">
        <AdminExplore nav="/" />
        <Slang nav="/slang" />
        <EditSlang nav="/editSlang" />
        <ChooseGif nav="/choose-gif" />
        <Profile nav="/otherProfile" />
      </View>
    </NavigationLayout>
  );
};
