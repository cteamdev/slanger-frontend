import type { FC, ReactNode } from 'react';
import { Match, Root, Epic } from '@unexp/router';
import {
  PanelHeader,
  SplitCol,
  SplitLayout,
  useAdaptivity,
  ViewWidth
} from '@vkontakte/vkui';

import { NavigationButton } from '../../types';

import { NavigationSideBar } from './NavigationSideBar';
import { NavigationTabbar } from './NavigationTabbar';

type Props = {
  children: ReactNode;

  buttons: NavigationButton[];
  menuVisibility: boolean;
};

export const NavigationLayout: FC<Props> = ({
  children,
  buttons,
  menuVisibility
}: Props) => {
  const { viewWidth } = useAdaptivity();

  const desktop: boolean = (viewWidth ?? 0) >= ViewWidth.SMALL_TABLET;
  const spaced: boolean = (viewWidth ?? 0) >= ViewWidth.SMALL_TABLET;
  const animate: boolean = (viewWidth ?? 0) <= ViewWidth.MOBILE;

  return (
    <Match>
      <SplitLayout
        header={!desktop && <PanelHeader separator={false} />}
        style={{ justifyContent: 'center' }}
      >
        <SplitCol
          spaced={spaced}
          animate={animate}
          width={desktop ? '650px' : '100%'}
          maxWidth={desktop ? '650px' : '100%'}
        >
          {desktop ? (
            <Root nav="/">{children}</Root>
          ) : (
            <Epic
              tabbar={
                !desktop &&
                menuVisibility && <NavigationTabbar buttons={buttons} />
              }
            >
              <Root nav="/">{children}</Root>
            </Epic>
          )}
        </SplitCol>

        {desktop && menuVisibility && <NavigationSideBar buttons={buttons} />}
      </SplitLayout>
    </Match>
  );
};
