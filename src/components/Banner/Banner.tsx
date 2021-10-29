import type { FC, MouseEventHandler } from 'react';
import { Banner as VKUIBanner, Button, getClassName } from '@vkontakte/vkui';

import './Banner.css';

export type BannerProps = {
  onButtonClick?: MouseEventHandler<HTMLElement>;
  style: 'duck';
  header: string;
  subheader: string;
  buttonText: string;
};

export const Banner: FC<BannerProps> = ({
  header,
  subheader,
  buttonText,
  style,
  onButtonClick
}: BannerProps) => (
  <VKUIBanner
    mode="image"
    header={header}
    subheader={subheader}
    className={getClassName('OurBanner')}
    background={
      <div
        className={
          style === 'duck'
            ? `OurBanner--pink ${getClassName('OurBanner')}`
            : getClassName('OurBanner')
        }
      />
    }
    actions={
      <Button mode="overlay_primary" onClick={onButtonClick}>
        {buttonText}
      </Button>
    }
  />
);
