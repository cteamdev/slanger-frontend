import './ImageGrid.css';

import type { DetailedHTMLProps, FC, ImgHTMLAttributes } from 'react';
import { Div } from '@vkontakte/vkui';

type Props = DetailedHTMLProps<
  ImgHTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

export const ImageGrid: FC<Props> = ({ children, ...other }: Props) => (
  <Div {...other} className={'Grid ' + other.className}>
    {children}
  </Div>
);
