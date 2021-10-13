import './Skeleton.css';

import type { DetailedHTMLProps, FC, ImgHTMLAttributes } from 'react';

type Props = DetailedHTMLProps<
  ImgHTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

export const Skeleton: FC<Props> = (props: Props) => (
  <div
    className="Skeleton"
    {...props}
    style={{ height: props.style?.height ?? 44, ...props.style }}
  />
);
