import type { FC } from 'react';
import { Tabbar, TabbarItem } from '@vkontakte/vkui';
import { transition, useLocation } from '@unexp/router';

import { NavigationButton } from '../../types';

type Props = {
  buttons: NavigationButton[];
};

export const NavigationTabbar: FC<Props> = ({ buttons }: Props) => {
  const { pathname } = useLocation();

  const item: string = pathname.split('/')[1];

  console.log(item);

  return (
    <Tabbar>
      {buttons.map(({ icon, story, text }: NavigationButton) => (
        <TabbarItem
          key={story}
          selected={item === story}
          text={text}
          onClick={() =>
            item !== story
              ? transition('/' + story)
              : window.scroll({ left: 0, top: 0, behavior: 'smooth' })
          }
        >
          {icon}
        </TabbarItem>
      ))}
    </Tabbar>
  );
};
