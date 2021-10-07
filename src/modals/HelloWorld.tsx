import type { FC } from 'react';
import { transition } from '@unexp/router';
import {
  Button,
  Div,
  Group,
  ModalPage,
  ModalPageHeader,
  PanelHeaderClose,
  usePlatform,
  VKCOM
} from '@vkontakte/vkui';

type Props = {
  id: string;
  nav?: string;
};

export const HelloWorldModal: FC<Props> = (props: Props) => {
  const close = () => transition(-1);

  const isMobile: boolean = usePlatform() !== VKCOM;

  return (
    <ModalPage
      id={props.id}
      nav={props.nav}
      onClose={close}
      header={
        <ModalPageHeader
          left={isMobile && <PanelHeaderClose onClick={close} />}
        >
          Рыба-текст
        </ModalPageHeader>
      }
    >
      <Group>
        <Div>
          Не следует, однако забывать, что новая модель организационной
          деятельности влечет за собой процесс внедрения и модернизации новых
          предложений. Задача организации, в особенности же новая модель
          организационной деятельности позволяет выполнять важные задания по
          разработке форм развития. Товарищи! укрепление и развитие структуры
          влечет за собой процесс внедрения и модернизации форм развития.
          Значимость этих проблем настолько очевидна, что укрепление и развитие
          структуры способствует подготовки и реализации позиций, занимаемых
          участниками в отношении поставленных задач. Задача организации, в
          особенности же постоянное информационно-пропагандистское обеспечение
          нашей деятельности влечет за собой процесс внедрения и модернизации
          существенных финансовых и административных условий. Разнообразный и
          богатый опыт постоянный количественный рост и сфера нашей активности
          позволяет оценить значение форм развития.
          <br />
          <br />
          <Button size="l" stretched onClick={close}>
            Закрыть
          </Button>
        </Div>
      </Group>
    </ModalPage>
  );
};
