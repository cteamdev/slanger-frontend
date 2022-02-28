import type { FC } from 'react';
import { Tabbar, TabbarItem } from '@vkontakte/vkui';
import { push, replace, useDeserialized } from '@itznevikat/router';

import { NavigationButton } from '../../types';
import { smoothScroll } from '../../utils';

type Props = {
  buttons: NavigationButton[];
  disabled: boolean;
};

export const NavigationTabbar: FC<Props> = ({ buttons, disabled }: Props) => {
  const { view, panel } = useDeserialized();

  return (
    <Tabbar>
      {buttons.map(({ icon, story, text }: NavigationButton) => (
        <TabbarItem
          key={story}
          selected={view === story}
          text={text}
          onClick={() =>
            view === story && window.scrollY !== 0
              ? smoothScroll()
              : !disabled &&
                (view !== story ? push(story) : panel !== '/' && replace(story))
          }
        >
          {icon}
        </TabbarItem>
      ))}
    </Tabbar>
  );
};
