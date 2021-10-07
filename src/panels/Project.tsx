import type { FC } from 'react';
import { transition, useHistoryState } from '@unexp/router';
import {
  Div,
  Group,
  Panel,
  PanelHeader,
  Title,
  Caption,
  SimpleCell,
  Avatar,
  IconButton,
  Spacing,
  Text,
  PanelHeaderBack
} from '@vkontakte/vkui';
import {
  Icon28MoreHorizontal,
  Icon28UserCircleOutline
} from '@vkontakte/icons';

type Props = {
  nav: string;
};

export const Project: FC<Props> = ({ nav }: Props) => {
  const { id } = useHistoryState<{ id: number }>();
  console.log(id);

  return (
    <Panel nav={nav}>
      <PanelHeader left={<PanelHeaderBack onClick={() => transition(-1)} />}>
        Проект #{id}
      </PanelHeader>

      <Group separator="hide">
        <Div>
          <Title level="3" weight="medium">
            Сделать библиотеку для работы со скиллами Маруси на NodeJS · 10000₽
          </Title>
          <Spacing />
          <Caption weight="regular" level="1" style={{ color: '#AAAEB2' }}>
            Программирование
          </Caption>
        </Div>
        <SimpleCell
          before={
            <Avatar
              size={48}
              src="https://sun4-10.userapi.com/s/v1/ig2/ippm_UX39S3r267sMlxehYWKTau5shCBuyVCe8HvocAhdiXEz_wQpNfkCIsVhYNIBJAwNw6Km0-5W20yJUZPfHIF.jpg?size=400x400&quality=96&crop=284,19,614,614&ava=1"
            />
          }
          after={
            <IconButton>
              <Icon28UserCircleOutline />
            </IconButton>
          }
          description="Автор"
        >
          Никита Кошеленко
        </SimpleCell>
        <SimpleCell
          before={
            <Avatar
              size={48}
              src="https://sun4-10.userapi.com/s/v1/ig2/5UcqWJ5VvxqmHXu6LpHuJgMzuv5AFWfmkSOcigbXSreQMyjhnFqtdqbRYHG_FHLtf7Q3eqDMfmb-KpbKr-waavEs.jpg?size=400x400&quality=96&crop=186,265,1157,1157&ava=1"
            />
          }
          after={
            // TODO: отображать если мы автор проекта
            <IconButton>
              <Icon28MoreHorizontal />
            </IconButton>
          }
          description="Исполнитель"
        >
          Гоша Панин
        </SimpleCell>
        <Div>
          <Text weight="regular">
            Нужно использовать Typescript и типизацию.
          </Text>
        </Div>
        <Div>
          <Text weight="regular">
            Не следует, однако забывать, что постоянный количественный рост и
            сфера нашей активности представляет собой интересный эксперимент
            проверки направлений прогрессивного развития. Таким образом
            постоянный количественный рост и сфера нашей активности обеспечивает
            широкому кругу (специалистов) участие в формировании системы
            обучения кадров, соответствует насущным потребностям. Повседневная
            практика показывает, что начало повседневной работы по формированию
            позиции позволяет выполнять важные задания по разработке
            существенных финансовых и административных условий.
          </Text>
        </Div>
      </Group>
    </Panel>
  );
};
