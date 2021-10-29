import { Avatar, Snackbar, ViewWidth } from '@vkontakte/vkui';
import { Icon16Cancel, Icon16Done } from '@vkontakte/icons';
import { useAtomState } from '@mntm/precoil';

import { useAdaptivity } from '../hooks';
import { snackbarAtom } from '../store';
import { SnackbarIconType } from '../types';

export const CustomSnackbar: React.FC = () => {
  const { viewWidth } = useAdaptivity();
  const [snackbar, setSnackbar] = useAtomState(snackbarAtom);

  const desktop: boolean = (viewWidth ?? 0) >= ViewWidth.SMALL_TABLET;

  return snackbar ? (
    <Snackbar
      onClose={() => setSnackbar(undefined)}
      before={
        <Avatar size={24} style={{ background: 'var(--accent)' }}>
          {snackbar.icon === SnackbarIconType.SUCCESS ? (
            <Icon16Done fill="#fff" width={14} height={14} />
          ) : (
            <Avatar size={24} style={{ backgroundColor: '#E64646' }}>
              <Icon16Cancel fill="#fff" width={14} height={14} />
            </Avatar>
          )}
        </Avatar>
      }
      style={
        !desktop
          ? {
              marginBottom:
                'calc(var(--tabbar_height) + var(--safe-area-inset-bottom))'
            }
          : {}
      }
    >
      {snackbar.text}
    </Snackbar>
  ) : (
    <></>
  );
};
