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
      await delay(400);

      setSnackbar({
        icon: SnackbarIconType.ERROR,
        text: body.message as string
      });
      throw body;
    }

    if (Date.now() - startTime < 250) await delay(250);

    return body;
  } catch (e: unknown) {
    await delay(400);

    setSnackbar({
      icon: SnackbarIconType.ERROR,
      text: 'Не удалось загрузить данные'
    });
    throw e;
  }
};
