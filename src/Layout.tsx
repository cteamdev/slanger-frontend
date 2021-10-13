import type { FC } from 'react';
import { transition, useParams, View } from '@unexp/router';
import { ModalRoot } from '@vkontakte/vkui';
import {
  Icon28BookmarkOutline,
  Icon28SearchOutline,
  Icon28UserCircleOutline
} from '@vkontakte/icons';
import { useAtomValue } from '@mntm/precoil';

import { ChooseGif, CreateSlang, Explore, Slang } from './panels';
import { ChooseGifModal, ShareSlangModal } from './modals';
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
          story: '/favorites',
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
