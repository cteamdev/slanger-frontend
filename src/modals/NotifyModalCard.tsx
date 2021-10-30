import type { FC } from 'react';
import { transition, useHistoryState } from '@unexp/router';
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
  const historyState: unknown = useHistoryState();

  const next = async (): Promise<void> => {
    transition(-1);
    await delay(800);
    transition('/slang?modal=settings', historyState);
  };

  return (
    <ModalCard
      nav={nav}
      onClose={() => transition(-1)}
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
