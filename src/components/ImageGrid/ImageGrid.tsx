import './ImageGrid.css';

import type { FC } from 'react';
import { Div } from '@vkontakte/vkui';

export const ImageGrid: FC = ({ children }) => (
  <Div className="Grid">{children}</Div>
);
