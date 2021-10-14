import { Placeholder } from '@vkontakte/vkui';
import { Icon56ErrorTriangleOutline } from '@vkontakte/icons';

export const ErrorPlaceholder: React.FC = () => (
  <Placeholder
    icon={<Icon56ErrorTriangleOutline />}
    header="Хьюстон, у нас проблема"
  >
    Не удалось получить данные. Попробуйте позже.
  </Placeholder>
);
