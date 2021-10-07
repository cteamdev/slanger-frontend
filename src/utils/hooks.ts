import { useEffect, useRef } from 'react';

/**
 * Кастомный useEffect хук, который триггерится только на зависимости, не на первый рендер
 * https://stackoverflow.com/a/55075818/1526448
 * @param effect Функция-эффект
 * @param dependencies Зависимости
 */
export function useUpdateEffect(
  effect: () => void,
  dependencies: any[] = []
): void {
  const isInitialMount = useRef<boolean>(true);

  useEffect(() => {
    if (isInitialMount.current) isInitialMount.current = false;
    else return effect();
  }, dependencies);
}
