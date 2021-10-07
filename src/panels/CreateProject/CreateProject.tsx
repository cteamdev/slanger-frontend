import './CreateProject.css';

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
  Textarea,
  Button,
  PanelHeaderBack
} from '@vkontakte/vkui';
import {
  Icon24Add,
  Icon24PhotosStackOutline,
  Icon24DocumentOutline
} from '@vkontakte/icons';

import { createProjectFormSchema } from '../../utils';
import { useCategories } from '../../hooks';
import {
  ImageGrid,
  ImageGridItem,
  CustomSnackbar,
  Skeleton
} from '../../components';

type Props = {
  nav: string;
};

export const CreateProject: FC<Props> = ({ nav }: Props) => {
  const { data: categories } = useCategories();

  return (
    <Panel nav={nav}>
      <PanelHeader left={<PanelHeaderBack onClick={() => transition(-1)} />}>
        Создание
      </PanelHeader>

      <Group>
        <CellButton
          before={
            <Avatar shadow={false} size={40}>
              <Icon24Add />
            </Avatar>
          }
        >
          Добавить обложку (4:1 - 16:9)
        </CellButton>
        <Formik
          initialValues={{
            category: '',
            header: '',
            description: '',
            price: '',
            text: ''
          }}
          onSubmit={(values) => {
            console.log(values);
          }}
          // Подробнее https://formik.org/docs/guides/validation
          validationSchema={createProjectFormSchema}
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
              <FormItem
                top="Категория"
                status={
                  touched.category && errors.category ? 'error' : 'default'
                }
                bottom={touched.category && errors.category}
              >
                {categories ? (
                  <Select
                    placeholder="Выберите категорию"
                    id="category"
                    value={values.category}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    options={categories.map((category, index) => ({
                      value: index + 1,
                      label: category
                    }))}
                  />
                ) : (
                  <Skeleton />
                )}
              </FormItem>
              <FormItem
                top="Заголовок"
                status={touched.header && errors.header ? 'error' : 'default'}
                bottom={touched.header && errors.header}
              >
                <Input
                  placeholder="Кратко и понятно"
                  id="header"
                  value={values.header}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </FormItem>
              <FormItem
                top="Бюджет"
                status={touched.price && errors.price ? 'error' : 'default'}
                bottom={touched.price && errors.price}
              >
                <Input
                  placeholder="В рублях"
                  type="number"
                  step={1}
                  // лучше так не делать, юзаем yup и выводим все красиво в стиле вкуи
                  // min={1}
                  // max={500000}
                  id="price"
                  value={values.price}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </FormItem>
              <FormItem
                top="Краткое описание"
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
              <FormItem
                top="Текст задания"
                status={touched.text && errors.text ? 'error' : 'default'}
                bottom={touched.text && errors.text}
              >
                <Textarea
                  placeholder="Развернуто и понятно: что нужно сделать, использовать и желаемый результат. Стоит приложить ТЗ"
                  id="text"
                  value={values.text}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </FormItem>
              <Div style={{ display: 'flex', gap: 8 }}>
                <Button
                  size="m"
                  stretched
                  before={<Icon24PhotosStackOutline />}
                  mode="tertiary"
                >
                  Фото
                </Button>
                <div
                  style={{ height: 'auto', width: 1, background: '#0000001F' }}
                />
                <Button
                  size="m"
                  stretched
                  before={<Icon24DocumentOutline />}
                  mode="tertiary"
                >
                  Файл
                </Button>
              </Div>
              <Spacing separator="top" />
              <ImageGrid>
                <ImageGridItem src="https://sun9-35.userapi.com/impg/XKl4aharZR7kKqCeimajZwPKJhOnXguKBNhqDQ/u5cE1RmjWY8.jpg?size=603x325&quality=96&sign=64be2916abd547c07518ca2a0a1af433&type=album" />
                <ImageGridItem src="https://sun9-35.userapi.com/impg/XKl4aharZR7kKqCeimajZwPKJhOnXguKBNhqDQ/u5cE1RmjWY8.jpg?size=603x325&quality=96&sign=64be2916abd547c07518ca2a0a1af433&type=album" />
                <ImageGridItem src="https://sun9-17.userapi.com/impg/KAmdlPnLwzLIduB3Rfp2mb6CISscAsXf0DLD0g/lZM_R4IzI2A.jpg?size=1024x1024&quality=96&sign=797265c77e0777aeaa92fd037556be1d&type=album" />
                <ImageGridItem src="https://sun9-35.userapi.com/impg/XKl4aharZR7kKqCeimajZwPKJhOnXguKBNhqDQ/u5cE1RmjWY8.jpg?size=603x325&quality=96&sign=64be2916abd547c07518ca2a0a1af433&type=album" />
                <ImageGridItem src="https://sun9-35.userapi.com/impg/XKl4aharZR7kKqCeimajZwPKJhOnXguKBNhqDQ/u5cE1RmjWY8.jpg?size=603x325&quality=96&sign=64be2916abd547c07518ca2a0a1af433&type=album" />
                <ImageGridItem src="https://sun9-17.userapi.com/impg/KAmdlPnLwzLIduB3Rfp2mb6CISscAsXf0DLD0g/lZM_R4IzI2A.jpg?size=1024x1024&quality=96&sign=797265c77e0777aeaa92fd037556be1d&type=album" />
                <ImageGridItem src="https://sun9-35.userapi.com/impg/XKl4aharZR7kKqCeimajZwPKJhOnXguKBNhqDQ/u5cE1RmjWY8.jpg?size=603x325&quality=96&sign=64be2916abd547c07518ca2a0a1af433&type=album" />
                <ImageGridItem src="https://sun9-35.userapi.com/impg/XKl4aharZR7kKqCeimajZwPKJhOnXguKBNhqDQ/u5cE1RmjWY8.jpg?size=603x325&quality=96&sign=64be2916abd547c07518ca2a0a1af433&type=album" />
                <ImageGridItem src="https://sun9-17.userapi.com/impg/KAmdlPnLwzLIduB3Rfp2mb6CISscAsXf0DLD0g/lZM_R4IzI2A.jpg?size=1024x1024&quality=96&sign=797265c77e0777aeaa92fd037556be1d&type=album" />
                <ImageGridItem src="https://sun9-35.userapi.com/impg/XKl4aharZR7kKqCeimajZwPKJhOnXguKBNhqDQ/u5cE1RmjWY8.jpg?size=603x325&quality=96&sign=64be2916abd547c07518ca2a0a1af433&type=album" />
                <ImageGridItem src="https://sun9-35.userapi.com/impg/XKl4aharZR7kKqCeimajZwPKJhOnXguKBNhqDQ/u5cE1RmjWY8.jpg?size=603x325&quality=96&sign=64be2916abd547c07518ca2a0a1af433&type=album" />
                <ImageGridItem src="https://sun9-17.userapi.com/impg/KAmdlPnLwzLIduB3Rfp2mb6CISscAsXf0DLD0g/lZM_R4IzI2A.jpg?size=1024x1024&quality=96&sign=797265c77e0777aeaa92fd037556be1d&type=album" />
              </ImageGrid>
              <Group className="Caption--container">
                <Caption level="1" weight="regular">
                  Создавая проект, вы соглашаетесь с{' '}
                  <a href="https://vk.com/@vfreelancepub-rules">
                    Правилами сервиса
                  </a>
                  . Создавать проекты можно только один раз в сутки.
                </Caption>
              </Group>
              <Div>
                <Button size="l" stretched type="submit">
                  Создать
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
