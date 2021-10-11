import { useSetAtomState } from '@mntm/precoil';

import { snackbarAtom } from '../store';
import { SnackbarIconType } from '../types';
import { delay } from './delay';

export const fetcher = async (
  resource: RequestInfo,
  init: RequestInit = {}
): Promise<any> => {
  const setSnackbar = useSetAtomState(snackbarAtom);
  const startTime: number = Date.now();

  try {
    const res: Response = await fetch('http://localhost:3000' + resource, {
      method: 'get',
      headers: {
        'x-vk': window.location.search.replace('?', ''),
        ...(init.headers ?? {})
      },
      ...init
    });
    const body: Record<string, unknown> = await res.json();

    if (!res.ok) {
      setTimeout(
        () =>
          setSnackbar({
            icon: SnackbarIconType.ERROR,
            text: body.message as string
          }),
        400
      );

      throw body;
    }

    if (Date.now() - startTime < 200) await delay(400);

    return body;
  } catch (e: unknown) {
    setTimeout(
      () =>
        setSnackbar({
          icon: SnackbarIconType.ERROR,
          text: 'Не удалось загрузить данные'
        }),
      400
    );

    throw e;
  }
};
