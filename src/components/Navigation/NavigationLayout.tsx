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
import { CustomSnackbar } from '../CustomSnackbar';

type Props = {
  children: ReactNode;

  buttons: (NavigationButton | null | false)[];
  menuVisibility: boolean;
};

export const NavigationLayout: FC<Props> = ({
  children,
  buttons: rawButtons,
  menuVisibility
}: Props) => {
  const { viewWidth } = useAdaptivity();

  const desktop: boolean = (viewWidth ?? 0) >= ViewWidth.SMALL_TABLET;
  const spaced: boolean = (viewWidth ?? 0) >= ViewWidth.SMALL_TABLET;
  const animate: boolean = (viewWidth ?? 0) <= ViewWidth.MOBILE;

  const buttons: NavigationButton[] = rawButtons.filter(
    (button) => !!button
  ) as NavigationButton[];

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
              tabbar={menuVisibility && <NavigationTabbar buttons={buttons} />}
            >
              {children}
            </Epic>
          )}

          <CustomSnackbar />
        </SplitCol>

        {desktop && menuVisibility && <NavigationSideBar buttons={buttons} />}
      </SplitLayout>
    </Match>
  );
};
