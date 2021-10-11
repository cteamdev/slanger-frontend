import type { FC, MouseEventHandler } from 'react';
import { Icon28CancelOutline } from '@vkontakte/icons';

type Props = {
  src: string;
  closeIcon?: boolean;
  onClick?: MouseEventHandler<HTMLDivElement>;
  onCloseClick?: MouseEventHandler<HTMLDivElement>;
};

export const ImageGridItem: FC<Props> = ({
  src,
  closeIcon,
  onClick,
  onCloseClick
}: Props) => (
  <div className="ImageGridItem" onClick={onClick}>
    <img src={src} alt="Картинка" loading="lazy" />
    {closeIcon && (
      <div onClick={onCloseClick}>
        <Icon28CancelOutline />
      </div>
    )}
  </div>
);
