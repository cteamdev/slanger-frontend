import type { FC } from 'react';
import { Cell, Group, Panel, SplitCol } from '@vkontakte/vkui';
import { push, replace, useDeserialized } from '@itznevikat/router';

import { NavigationButton } from '../../types';
import { smoothScroll } from '../../utils';
import { CreditsFooter } from '../CreditsFooter';

type Props = {
  buttons: NavigationButton[];
  disabled: boolean;
};

export const NavigationSideBar: FC<Props> = ({ buttons, disabled }: Props) => {
  const { view, panel } = useDeserialized();

  return (
    <SplitCol fixed width="280px" maxWidth="280px">
      <Panel>
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
                view === story && window.scrollY !== 0
                  ? smoothScroll()
                  : !disabled &&
                    (view !== story
                      ? push(story)
                      : panel !== '/' && replace(story))
              }
            >
              {text}
            </Cell>
          ))}
        </Group>

        <CreditsFooter />
      </Panel>
    </SplitCol>
  );
};
