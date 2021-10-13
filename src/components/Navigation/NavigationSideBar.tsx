import type { FC } from 'react';
import {
  Cell,
  Group,
  Panel,
  PanelHeader,
  SplitCol,
  useAdaptivity,
  ViewWidth
} from '@vkontakte/vkui';
import { transition, useLocation } from '@unexp/router';

import { NavigationButton } from '../../types';
import { smoothScroll } from '../../utils';

type Props = {
  buttons: NavigationButton[];
};

export const NavigationSideBar: FC<Props> = ({ buttons }: Props) => {
  const { viewWidth } = useAdaptivity();
  const { pathname } = useLocation();

  const desktop: boolean = (viewWidth ?? 0) >= ViewWidth.SMALL_TABLET;
  const item: string = pathname.split('/')[1];

  return (
    <SplitCol fixed width="280px" maxWidth="280px">
      <Panel>
        {!desktop && <PanelHeader />}
        <Group>
          {buttons.map(({ icon, story, text }: NavigationButton) => (
            <Cell
              key={story}
              before={icon}
              style={
                item === story
                  ? {
                      backgroundColor: 'var(--button_secondary_background)',
                      borderRadius: 8
                    }
                  : {}
              }
              onClick={() =>
                item !== story ? transition('/' + story) : smoothScroll()
              }
            >
              {text}
            </Cell>
          ))}
        </Group>
      </Panel>
    </SplitCol>
  );
};
