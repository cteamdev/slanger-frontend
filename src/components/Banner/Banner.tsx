import type { FC } from 'react';
import { Banner as VKUIBanner, Button } from '@vkontakte/vkui';

import './Banner.css';

export const Banner: FC = () => (
  <VKUIBanner
    mode="image"
    header="Симпл-димпл"
    subheader="Словосочетание дня"
    background={<div className="OurBanner" />}
    actions={<Button mode="overlay_primary">Открыть</Button>}
  />
);
