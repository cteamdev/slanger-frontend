import type { FC } from 'react';
import { Icon28CancelOutline } from '@vkontakte/icons';

type Props = {
  src: string;
};

export const ImageGridItem: FC<Props> = ({ src }: Props) => (
  <div className="ImageGridItem">
    <img src={src} alt="Картинка" />
    <div>
      <Icon28CancelOutline />
    </div>
  </div>
);
