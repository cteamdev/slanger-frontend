import { Avatar, Snackbar } from '@vkontakte/vkui';
import { Icon16Cancel, Icon16Done } from '@vkontakte/icons';
import { useAtomState } from '@mntm/precoil';

import { snackbarAtom } from '../store';
import { SnackbarIconType } from '../types';

export const CustomSnackbar: React.FC = () => {
  const [snackbar, setSnackbar] = useAtomState(snackbarAtom);

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
    >
      {snackbar.text}
    </Snackbar>
  ) : (
    <></>
  );
};
