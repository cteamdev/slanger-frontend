import type { FC } from 'react';

import { Root, View } from '@vkontakte/vkui';

import { Home } from './Home';

export const Layout: FC = () => {
  return (
    <Root activeView="/">
      <View nav="/" activePanel="/">
        <Home nav="/" />
      </View>
    </Root>
  );
};
