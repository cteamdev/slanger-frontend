import './CreateSlang.css';

import type { FC } from 'react';
import { Formik } from 'formik';
import { transition } from '@unexp/router';
import {
  Div,
  Group,
  Panel,
  PanelHeader,
  Input,
  Caption,
  Avatar,
  Spacing,
  CellButton,
  FormItem,
  Select,
  Button,
  PanelHeaderBack,
  useAdaptivity,
  ViewWidth
} from '@vkontakte/vkui';
import { Icon24Add } from '@vkontakte/icons';

import { createSlangFormSchema } from '../../utils';
import { CustomSnackbar } from '../../components';
import { CreateSlangDto } from '../../types';

type Props = {
  nav: string;
};

export const CreateSlang: FC<Props> = ({ nav }: Props) => {
  const types = [
    'Слово',
    'Словосочетание',
    'Пословица',
    'Фразеологизм'
  ] as CreateSlangDto['type'][]
  const { viewWidth } = useAdaptivity();

  const desktop: boolean = (viewWidth ?? 0) >= ViewWidth.SMALL_TABLET;

  const onSubmit = (
    values: Omit<components['schemas']['CreateSlangDto'], 'type'>
  ) => {
    transition(-1);
  };

  return (
    <Panel nav={nav}>
      <PanelHeader left={<PanelHeaderBack onClick={() => transition(-1)} />}>
        Создание
      </PanelHeader>

      <Group>
        <Formik
          initialValues={
            {
              type: '0',
              word: '',
              description: '',
              cover: ''
            } as Omit<CreateSlangDto, 'type'>
          }
          onSubmit={(values) => {
            console.log(values);
          }}
          validationSchema={createSlangFormSchema}
        >
          {({
            values,
            handleSubmit,
            handleBlur,
            handleChange,
            errors,
            touched
          }) => (
            <form onSubmit={handleSubmit}>
              <CellButton
                before={
                  <Avatar shadow={false} size={40}>
                    <Icon24Add />
                  </Avatar>
                }
                onClick={() =>
                  desktop
                    ? transition('/explore/create?modal=choose-gif')
                    : transition('/explore/choose-gif')
                }
              >
                Добавить обложку <br />
                <Caption
                  level="1"
                  weight="regular"
                  style={{ color: '#909499' }}
                >
                  Необязательно
                </Caption>
                <Caption
                  level="1"
                  weight="regular"
                  style={{ color: 'var(--field_error_border)' }}
                >
                  {errors.cover}
                </Caption>
              </CellButton>
              <FormItem
                top="Тип выражения"
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                status={touched.type && errors.type ? 'error' : 'default'}
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                bottom={touched.type && errors.type}
              >
                <Select
                  placeholder="Выберите тип выражения"
                  id="type"
                  name="type"
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore
                  value={values.type}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  options={types.map((category, index) => ({
                    value: index + 1,
                    label: category
                  }))}
                />
              </FormItem>
              <FormItem
                top="Выражение"
                status={touched.word && errors.word ? 'error' : 'default'}
                bottom={touched.word && errors.word}
              >
                <Input
                  placeholder="Введите выражение"
                  id="word"
                  value={values.word}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </FormItem>
              <FormItem
                top="Описание"
                status={
                  touched.description && errors.description
                    ? 'error'
                    : 'default'
                }
                bottom={touched.description && errors.description}
              >
                <Input
                  placeholder="Коротко и ясно"
                  id="description"
                  value={values.description}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </FormItem>
              <Spacing separator="top" />
              <Group className="Caption--container">
                <Caption level="1" weight="regular">
                  Предлагая новое выражение, вы соглашаетесь с{' '}
                  <a href="https://vk.com/@slangerpub-rules">
                    Правилами сервиса
                  </a>
                  . Лимит: 10 выражений в сутки.
                </Caption>
              </Group>
              <Div>
                <Button size="l" stretched type="submit">
                  Предложить
                </Button>
              </Div>
            </form>
          )}
        </Formik>
      </Group>

      <CustomSnackbar />
    </Panel>
  );
};
