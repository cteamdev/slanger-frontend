import * as yup from 'yup';

export const createSlangFormSchema = yup.object().shape({
  type: yup.number().required('Выберите тип выражения.'),
  word: yup
    .string()
    .min(1, 'Укажите выражение от 1 до 60 символов.')
    .max(40, 'Укажите выражение от 1 до 60 символов.')
    .required('Укажите выражение от 1 до 60 символов.'),
  description: yup
    .string()
    .min(1, 'Укажите описание от 1 до 1000 символов.')
    .max(1000, 'Укажите описание от 1 до 1000 символов.')
    .required('Укажите описание от 1 до 1000 символов.')
});
