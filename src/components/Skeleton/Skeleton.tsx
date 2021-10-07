import './Skeleton.css';

import type { CSSProperties, FC } from 'react';

export type SkeletonProps = {
  height?: number;
  style?: CSSProperties;
};

export const Skeleton: FC<SkeletonProps> = ({
  height,
  style
}: SkeletonProps) => (
  <div className="Skeleton" style={{ height: height ?? 44, ...style }} />
);
