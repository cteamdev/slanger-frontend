import type { FC } from 'react';
import {
  Cell,
  Footer,
  Group,
  Panel,
  PanelHeader,
  SplitCol,
  useAdaptivity,
  ViewWidth
} from '@vkontakte/vkui';
import { transition, useDeserializedLocation } from '@unexp/router';

import { NavigationButton } from '../../types';
import { smoothScroll } from '../../utils';

type Props = {
  buttons: NavigationButton[];
};

export const NavigationSideBar: FC<Props> = ({ buttons }: Props) => {
  const { viewWidth } = useAdaptivity();
  const { view } = useDeserializedLocation();

  const desktop: boolean = (viewWidth ?? 0) >= ViewWidth.SMALL_TABLET;

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
                view === story
                  ? {
                      backgroundColor: 'var(--button_secondary_background)',
                      borderRadius: 8
                    }
                  : {}
              }
              onClick={() =>
                view !== story ? transition(story) : smoothScroll()
              }
            >
              {text}
            </Cell>
          ))}
        </Group>

        <Footer style={{ marginTop: 0 }}>
          Сделано с любовью <br />
          {'<'}3 cteamdev, 2021
        </Footer>
      </Panel>
    </SplitCol>
  );
};
