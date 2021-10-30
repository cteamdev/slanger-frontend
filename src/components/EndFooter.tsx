import { Caption } from '@vkontakte/vkui';

export const EndFooter: React.FC = () => (
  <Caption
    level="1"
    weight="regular"
    style={{
      textAlign: 'center',
      color: '#909499',
      marginTop: 12,
      marginBottom: 12
    }}
  >
    Ты дошёл до конца
  </Caption>
);
