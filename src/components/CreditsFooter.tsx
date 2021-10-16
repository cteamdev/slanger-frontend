import { Footer } from '@vkontakte/vkui';

export const CreditsFooter: React.FC = () => (
  <Footer style={{ marginTop: 0 }}>
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
  </Footer>
);
