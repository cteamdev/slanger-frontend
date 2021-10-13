import type { DetailedHTMLProps, FC, ImgHTMLAttributes } from 'react';

type Props = DetailedHTMLProps<
  ImgHTMLAttributes<HTMLImageElement>,
  HTMLImageElement
>;

export const ImageGridItem: FC<Props> = ({ src, onClick, ...other }: Props) => (
  <div className="ImageGridItem" onClick={onClick}>
    <img src={src} {...other} />
  </div>
);
