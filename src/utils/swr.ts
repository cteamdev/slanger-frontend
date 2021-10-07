import { useSetAtomState } from '@mntm/precoil';

import { snackbarAtom } from '../store';
import { SnackbarIconType } from '../types';

export const fetcher = async (
  resource: RequestInfo,
  init: RequestInit
): Promise<any> => {
  const setSnackbar = useSetAtomState(snackbarAtom);

  try {
    const res: Response = await fetch('http://localhost:3000' + resource, {
      method: 'post',
      headers: {
        'x-vk': window.location.search.replace('?', ''),
        ...(init.headers ?? {})
      },
      ...init
    });
    const body: Record<string, unknown> = await res.json();

    if (!res.ok)
      return void setTimeout(
        () =>
          setSnackbar({
            icon: SnackbarIconType.ERROR,
            text: body.message as string
          }),
        400
      );

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
  }
};

export const getFetcher =
  (requestInit: RequestInit): typeof fetcher =>
  (resource: RequestInfo, init: RequestInit) =>
    fetcher(resource, { ...requestInit, ...init });
