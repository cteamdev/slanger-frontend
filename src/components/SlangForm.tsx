import type { ChangeEvent, FC } from 'react';
import type { Asserts, ValidationError } from 'yup';

import * as yup from 'yup';
import { useReducer } from 'react';
import { useAtomValue } from '@mntm/precoil';
import { transition, useDeserializedLocation } from '@unexp/router';
import {
  Div,
  Group,
  Input,
  Caption,
  Avatar,
  Spacing,
  CellButton,
  FormItem,
  Select,
  Button,
  useAdaptivity,
  ViewWidth,
  FormLayout,
  Footer
} from '@vkontakte/vkui';
import { Icon24AddOutline } from '@vkontakte/icons';

import { CreateSlangDto } from '../types';
import { gifAtom } from '../store';

type Props = {
  mode: 'create' | 'edit';
  initialValues?: Schema;

  handleSubmit: (values: Schema) => Promise<void>;
};

export const SlangForm: FC<Props> = ({
  mode,
  initialValues = {
    type: 0,
    word: '',
    description: ''
  },
  handleSubmit: parentHandleSubmit
}: Props) => {
  const { viewWidth } = useAdaptivity();
  const { view, panel } = useDeserializedLocation();

  const gif: string | null = useAtomValue(gifAtom);

  const [values, dispatchValues] = useReducer(
    (state: Schema, action: Partial<Schema>) => ({
      ...state,
      ...action
    }),
    initialValues
  );

  const [errors, dispatchErrors] = useReducer(
    (state: SchemaErrors, action: Partial<SchemaErrors>) => ({
      ...state,
      ...action
    }),
    {
      type: null,
      word: null,
      description: null
    } as SchemaErrors
  );

  const desktop: boolean = (viewWidth ?? 0) >= ViewWidth.SMALL_TABLET;

  const selectCover = (): void =>
    transition(
      desktop ? `${view}${panel}?modal=choose-gif` : `${view}/choose-gif`
    );

  const handleChange = (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>
  ): void => {
    if (!(e.target.name in values)) return;

    if (e.target.name === 'type') dispatchErrors({ type: null });

    dispatchValues({
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (): Promise<void> => {
    dispatchErrors({ type: null, word: null, description: null });

    const validation: Schema | void = await schema
      .validate(values)
      .catch(({ path, errors }: ValidationError) => {
        path && path in values && dispatchErrors({ [path]: errors[0] });
      });
    if (!validation) return;

    parentHandleSubmit(values);
  };

  return (
    <FormLayout>
      {gif ? (
        <>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              height: '256px',
              cursor: 'pointer'
            }}
            onClick={selectCover}
          >
            <img src={gif} crossOrigin="anonymous" />
          </div>
          <Footer>Нажми на обложку, чтобы изменить или удалить</Footer>
        </>
      ) : (
        <CellButton
          before={
            <Avatar shadow={false} size={40}>
              <Icon24AddOutline />
            </Avatar>
          }
          onClick={selectCover}
        >
          Добавить обложку <br />
          <Caption level="1" weight="regular" style={{ color: '#909499' }}>
            Необязательно
          </Caption>
        </CellButton>
      )}

      <FormItem
        top="Тип выражения"
        status={errors.type ? 'error' : 'default'}
        bottom={errors.type}
      >
        <Select
          name="type"
          placeholder="Выберите тип выражения"
          value={values.type !== 0 ? values.type : undefined}
          onChange={handleChange}
          options={types.map((type, index) => ({
            value: index + 1,
            label: `${type} (${points[index]} баллов)`
          }))}
        />
      </FormItem>
      <FormItem
        top="Выражение"
        status={errors.word ? 'error' : 'default'}
        bottom={errors.word}
      >
        <Input
          name="word"
          placeholder="Например, кринж"
          value={values.word}
          onChange={handleChange}
        />
      </FormItem>
      <FormItem
        top="Описание"
        status={errors.description ? 'error' : 'default'}
        bottom={errors.description}
      >
        <Input
          name="description"
          placeholder="Понятно для читателя"
          value={values.description}
          onChange={handleChange}
        />
      </FormItem>
      <Spacing separator="top" />
      <Group mode="plain">
        <Caption
          level="1"
          weight="regular"
          style={{ textAlign: 'center', color: '#909499' }}
        >
          {mode === 'create' ? 'Предлагая новое' : 'Изменяя'} выражение, вы
          соглашаетесь с{' '}
          <a
            href="https://vk.com/@slangerpub-rules"
            target="_blank"
            style={{ color: 'inherit' }}
          >
            Правилами сервиса
          </a>
          . <br />
          Награда указана при выборе типа выражения. <br />
          Максимум 10 выражений в сутки.
        </Caption>
      </Group>
      <Div>
        <Button stretched size="l" onClick={handleSubmit}>
          {mode === 'create' ? 'Предложить' : 'Изменить'}
        </Button>
      </Div>
    </FormLayout>
  );
};

export const types: CreateSlangDto['type'][] = [
  'Слово',
  'Словосочетание',
  'Пословица',
  'Фразеологизм'
];
export const points: number[] = [8, 10, 12, 12];
export const schema = yup
  .object({
    // В обратном порядке, так как yup читает именно так
    description: yup
      .string()
      .min(1, 'Укажите описание от 1 до 1000 символов.')
      .max(1000, 'Укажите описание от 1 до 1000 символов.')
      .required('Укажите описание от 1 до 1000 символов.'),
    word: yup
      .string()
      .min(1, 'Укажите выражение от 1 до 60 символов.')
      .max(40, 'Укажите выражение от 1 до 60 символов.')
      .required('Укажите выражение от 1 до 60 символов.'),
    type: yup
      .number()
      .min(1, 'Заполните это поле.')
      .max(types.length + 1, 'Заполните это поле.')
      .required('Заполните это поле.')
  })
  .required();

export type Schema = Asserts<typeof schema>;
export type SchemaErrors = Record<keyof Schema, string | null>;