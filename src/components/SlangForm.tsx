import type { FC } from 'react';
import type { Asserts, ValidationError } from 'yup';

import * as yup from 'yup';
import { useReducer } from 'react';
import { useAtomState, useAtomValue } from '@mntm/precoil';
import { push, useDeserialized } from '@itznevikat/router';
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
  ViewWidth,
  FormLayout,
  Footer,
  Checkbox,
  Textarea,
  Link
} from '@vkontakte/vkui';
import { ChipsSelect } from '@vkontakte/vkui/unstable';
import { Icon24AddOutline } from '@vkontakte/icons';

import { useAdaptivity } from '../hooks';
import { CreateSlangDto } from '../types';
import { gifAtom, rightsAtom, valuesAtom } from '../store';

type Props = {
  mode: 'create' | 'edit';

  handleSubmit: (values: Schema) => Promise<void>;
};

export const SlangForm: FC<Props> = ({
  mode,
  handleSubmit: parentHandleSubmit
}: Props) => {
  const { viewWidth } = useAdaptivity();
  const { view, panel } = useDeserialized();

  const rights: string = useAtomValue(rightsAtom);
  const gif: string | null = useAtomValue(gifAtom);

  const [values, dispatchValues] = useAtomState(valuesAtom);

  const [errors, dispatchErrors] = useReducer(
    (state: SchemaErrors, action: Partial<SchemaErrors>) => ({
      ...state,
      ...action
    }),
    {} as SchemaErrors
  );

  const desktop: boolean = (viewWidth ?? 0) >= ViewWidth.SMALL_TABLET;

  const selectCover = (): void => {
    if (desktop) {
      push(`${view === '/' ? '' : view}${panel}?modal=choose-gif`);
    } else {
      push(`${view === '/' ? '' : view}/choose-gif`);
    }
  };

  const handleChange = (name: string, value: unknown): void => {
    dispatchErrors({ [name]: null });
    dispatchValues({
      ...values,
      [name]: value
    });
  };

  const handleSubmit = async (): Promise<void> => {
    dispatchErrors({ type: null, word: null, description: null, themes: null });

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
              cursor: 'pointer',
              maxHeight: '256px',
              maxWidth: '98%',
              margin: 0
            }}
            onClick={selectCover}
          >
            <img
              src={gif}
              crossOrigin="anonymous"
              style={{ marginLeft: '2%', maxWidth: '100%', borderRadius: 4 }}
            />
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
          onChange={({ target }) => {
            dispatchErrors({ type: null });
            handleChange(target.name, target.value);
          }}
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
          onChange={({ target }) => handleChange(target.name, target.value)}
        />
      </FormItem>
      <FormItem
        top="Описание"
        status={errors.description ? 'error' : 'default'}
        bottom={errors.description}
      >
        <Textarea
          name="description"
          placeholder="Понятное для читателя"
          value={values.description}
          onChange={({ target }) => handleChange(target.name, target.value)}
        />
      </FormItem>
      <FormItem
        top="Темы"
        status={errors.themes ? 'error' : 'default'}
        bottom={errors.themes}
      >
        <ChipsSelect
          name="themes"
          placeholder="Несколько, необязательно"
          value={values.themes.map((theme) => ({ label: theme, value: theme }))}
          options={themes.map((theme) => ({ label: theme, value: theme }))}
          onChange={(options) =>
            handleChange(
              'themes',
              options.map((option) => option.value)
            )
          }
        />
      </FormItem>

      {['moderator', 'admin'].includes(rights) && (
        <FormItem
          status={errors.fromEdition ? 'error' : 'default'}
          bottom={errors.fromEdition}
        >
          <Checkbox
            name="fromEdition"
            checked={values.fromEdition}
            onChange={({ target }) => handleChange(target.name, target.checked)}
          >
            От имени редакции
          </Checkbox>
        </FormItem>
      )}

      <Spacing separator="top" />
      <Group mode="plain">
        <Div>
          <Caption
            level="1"
            weight="regular"
            style={{ textAlign: 'center', color: '#909499' }}
          >
            {mode === 'create' ? 'Предлагая новое' : 'Изменяя'} выражение, вы
            соглашаетесь с{' '}
            <Link
              href="https://vk.com/@slangerpub-rules"
              target="_blank"
              style={{ color: 'inherit', textDecorationLine: 'underline' }}
            >
              Правилами сервиса
            </Link>
            . <br />
            Награда указана при выборе типа выражения. <br />
            Максимум 10 выражений в сутки.
          </Caption>
        </Div>
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
export const themes: CreateSlangDto['themes'] = [
  'Сленг',
  'Диалект',
  'Мемы',
  'Игры',
  'Политика',
  'Общество',
  'Интернет',
  'Наука',
  'Спорт',
  'Музыка',
  'Искусство',
  'Религия'
];
export const points: number[] = [8, 10, 12, 12];
export const voidValues: Schema = {
  type: 0,
  word: '',
  description: '',
  themes: [],
  fromEdition: false
};
export const schema = yup
  .object({
    // В обратном порядке, так как yup читает именно так
    fromEdition: yup.boolean(),
    themes: yup.array().of(yup.string().oneOf(themes).required()).required(),
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
