import type { FC, MouseEventHandler } from 'react';
import { Banner as VKUIBanner, Button } from '@vkontakte/vkui';

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
    background={<div className={style === 'duck' ? 'OurBanner--pink' : ''} />}
    actions={
      <Button mode="overlay_primary" onClick={onButtonClick}>
        {buttonText}
      </Button>
    }
  />
);
