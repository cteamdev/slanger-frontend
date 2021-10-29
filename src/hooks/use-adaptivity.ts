import { useRef } from 'react';
import {
  AdaptivityProps,
  useAdaptivity as useVKUIAdaptivity
} from '@vkontakte/vkui';

export const useAdaptivity = (): AdaptivityProps => {
  const currentAdaptivity = useVKUIAdaptivity();
  const adaptivity = useRef(currentAdaptivity);

  return adaptivity.current;
};
