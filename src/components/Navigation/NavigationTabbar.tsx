import type { FC } from 'react';
import { Tabbar, TabbarItem } from '@vkontakte/vkui';
import { transition, useDeserializedLocation } from '@unexp/router';

import { NavigationButton } from '../../types';
import { smoothScroll } from '../../utils';

type Props = {
  buttons: NavigationButton[];
};

export const NavigationTabbar: FC<Props> = ({ buttons }: Props) => {
  const { view } = useDeserializedLocation();

  return (
    <Tabbar>
      {buttons.map(({ icon, story, text }: NavigationButton) => (
        <TabbarItem
          key={story}
          selected={view === story}
          text={text}
          onClick={() => (view !== story ? transition(story) : smoothScroll())}
        >
          {icon}
        </TabbarItem>
      ))}
    </Tabbar>
  );
};
