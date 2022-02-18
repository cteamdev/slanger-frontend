import { snackbarAtom } from '../store';
import { SnackbarIconType } from '../types';
import { delay } from './delay';

export type FetcherOptions = RequestInit & {
  throw?: boolean;
};

export const fetcher = async (
  resource: RequestInfo,
  init: FetcherOptions = { throw: true }
): Promise<any> => {
  const startTime: number = Date.now();

  try {
    const res: Response = await fetch(
      'https://slanger-backend.cteam.codes' + resource,
      {
        method: 'get',
        ...init,
        headers: {
          'x-vk': window.location.search.replace('?', ''),
          ...(init.headers ?? {})
        }
      }
    ).catch((e: unknown) => {
      if (init.throw)
        snackbarAtom.set({
          icon: SnackbarIconType.ERROR,
          text: 'Не удалось загрузить данные'
        });

      throw e;
    });
    const body: Record<string, unknown> = await res.json();

    if (!res.ok) {
      if (init.throw)
        snackbarAtom.set({
          icon: SnackbarIconType.ERROR,
          text: body.message as string
        });

      throw body;
    }

    if (Date.now() - startTime < 250) await delay(250);

    return body;
  } catch (e: unknown) {
    await delay(400);

    throw e;
  }
};
