import { Placeholder } from '@vkontakte/vkui';
import { Icon56CompassOutline } from '@vkontakte/icons';

export const VoidPlaceholder: React.FC = () => (
  <Placeholder icon={<Icon56CompassOutline />} header="Пустота">
    Здесь ничего нет...
  </Placeholder>
);
