import type { CSSProperties, FC, MouseEventHandler, ReactNode } from 'react';

import { Button, Div, Title, ViewWidth } from '@vkontakte/vkui';
import { Icon24Chevron } from '@vkontakte/icons';

import { useAdaptivity } from '../hooks';

type Props = {
  title: string;
  children: ReactNode;
  imageSrc?: string;
  icon?: ReactNode;
  style?: CSSProperties;
  buttonText: string;
  onClick: MouseEventHandler<HTMLElement>;
};

export const OnboardingSlide: FC<Props> = ({
  title,
  children,
  imageSrc,
  icon,
  style = {},
  buttonText,
  onClick
}: Props) => {
  const { viewWidth } = useAdaptivity();

  const desktop: boolean = (viewWidth ?? 0) >= ViewWidth.SMALL_TABLET;

  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          height: '100%'
        }}
      >
        {icon}
        {imageSrc && (
          <img
            src={imageSrc}
            style={{
              maxWidth: '90%',
              height: desktop ? '256px' : '36%',
              ...style
            }}
          />
        )}
        <Title weight="semibold" level="1" style={{ marginTop: 10 }}>
          {title}
        </Title>
        <div style={{ marginTop: 12, width: '90%' }}>{children}</div>
      </div>

      <Div>
        <Button
          stretched
          size="l"
          mode="secondary"
          after={<Icon24Chevron />}
          onClick={onClick}
        >
          {buttonText}
        </Button>
      </Div>
    </div>
  );
};
