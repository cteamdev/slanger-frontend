import type { FC } from 'react';
import { back, push, useMeta } from '@itznevikat/router';
import { Button, ModalCard } from '@vkontakte/vkui';

import {
  Icon24ChevronRight,
  Icon56NotificationOutline
} from '@vkontakte/icons';
import { delay } from '../utils';

type Props = {
  nav: string;
};

export const NotifyModalCard: FC<Props> = ({ nav }: Props) => {
  const meta = useMeta();

  const next = async (): Promise<void> => {
    back();
    await delay(800);
    push('/slang?modal=settings', meta);
  };

  return (
    <ModalCard
      nav={nav}
      onClose={back}
      icon={<Icon56NotificationOutline />}
      header="Получите уведомление, когда ваш сленг пройдёт модерацию"
      subheader="И не только! Включите уведомления в настройках."
      actions={
        <Button
          size="l"
          mode="primary"
          after={<Icon24ChevronRight />}
          onClick={next}
        >
          Перейти
        </Button>
      }
    />
  );
};
