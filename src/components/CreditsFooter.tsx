import { Caption } from '@vkontakte/vkui';

export const CreditsFooter: React.FC = () => (
  <Caption
    level="1"
    weight="regular"
    style={{ textAlign: 'center', color: '#909499', marginBottom: 24 }}
  >
    Сделано с любовью <br />
    {'<'}3{' '}
    <a
      href="https://vk.com/cteamdev"
      target="_blank"
      style={{ color: 'inherit' }}
    >
      cteamdev
    </a>
    , 2021
  </Caption>
);
