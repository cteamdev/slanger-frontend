import type { FC } from 'react';
import { Tabbar, TabbarItem } from '@vkontakte/vkui';
import { transition, useDeserializedLocation } from '@unexp/router';

import { NavigationButton } from '../../types';

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
          onClick={() =>
            view !== story
              ? (console.log(story), transition(story))
              : window.scroll({ left: 0, top: 0, behavior: 'smooth' })
          }
        >
          {icon}
        </TabbarItem>
      ))}
    </Tabbar>
  );
};
