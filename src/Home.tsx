import { type FC } from 'react';

import { Button, Link, NavIdProps, Panel, Placeholder } from '@vkontakte/vkui';

export const Home: FC<NavIdProps> = ({ nav }) => (
  <Panel nav={nav} style={{ background: 'var(--background_content)' }}>
    <Placeholder
      stretched
      header="Slanger — всё"
      icon={<img src="/avatar.png" width="86" />}
      action={
        <Button size="m" mode="tertiary">
          <Link href="https://vk.com/cteamdev">
            Подписаться на разработчиков
          </Link>
        </Button>
      }
    >
      <div style={{ height: 12 }} />
      <div style={{ color: 'var(--text_primary)' }}>
        У нас было достаточно увлекательное приключение: почти месяц активной
        разработки и фикса багов, выход в каталог, первые пользователи, а затем
        победа в конкурсе.
        <br />
        <br />
        За всё время было создано 739 выражений, из которых 246 успешно прошли
        модерацию.
        <br />
        <br />
        Мы благодарны всем пользователям. Ещё увидимся!
      </div>
    </Placeholder>
  </Panel>
);
