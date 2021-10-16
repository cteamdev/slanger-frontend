import type { FC } from 'react';

import { useState } from 'react';
import { send } from '@vkontakte/vk-bridge';
import { transition } from '@unexp/router';
import {
  Panel,
  Group,
  Gallery,
  useAdaptivity,
  ViewWidth,
  Text,
  Caption
} from '@vkontakte/vkui';
import { OnboardingSlide } from '../components';
import { Icon56GestureOutline } from '@vkontakte/icons';

type Props = {
  nav: string;
};

export const Onboarding: FC<Props> = ({ nav }: Props) => {
  const { viewWidth } = useAdaptivity();

  const [slideIndex, setSlideIndex] = useState<number>(0);

  const desktop: boolean = (viewWidth ?? 0) >= ViewWidth.SMALL_TABLET;

  const next = (): void => setSlideIndex(slideIndex + 1);
  const end = (): void => {
    // Синхронно, чтобы не заставлять пользователя ждать
    send('VKWebAppStorageSet', { key: 'onboarding', value: 'true' });
    transition('/dictionary');
  };

  return (
    <Panel nav={nav}>
      <Group>
        <Gallery
          slideWidth="100%"
          style={{
            width: '100%',
            height: desktop
              ? 'calc(100vh - 48px)'
              : 'calc(100vh - var(--tabbar_height) - var(--safe-area-inset-bottom) - 16px)'
          }}
          align="center"
          slideIndex={slideIndex}
          onChange={(i) => setSlideIndex(i)}
          isDraggable={true}
        >
          <OnboardingSlide
            title="Slanger"
            imageSrc="/src/assets/avatar.png"
            style={desktop ? { height: 150 } : {}}
            buttonText="Далее"
            onClick={next}
          >
            <Text weight="regular">
              Кринж, рофл, зашквар - эти, а также многие другие современные
              слова мы знаем хорошо и готовы рассказать тебе их значения.
            </Text>

            <Text weight="medium">
              Добро пожаловать в slanger - словарь XXI века!
            </Text>
          </OnboardingSlide>
          <OnboardingSlide
            title="Словарь"
            imageSrc="/src/assets/onboarding-1.png"
            buttonText="Далее"
            onClick={next}
          >
            <Text weight="regular">
              Здесь ты можешь найти нужное слово, словосочетание, пословицу или
              фразеологизм. Есть случаное выражение, которое можно просмотреть.
            </Text>
          </OnboardingSlide>
          <OnboardingSlide
            title="Профиль"
            imageSrc="/src/assets/onboarding-2.png"
            buttonText="Далее"
            onClick={next}
          >
            <Text weight="regular">
              А тут вся информация о тебе, которую мы храним. Можно увидеть
              баллы, которые выдаются за предложенные тобой выражения.
            </Text>
          </OnboardingSlide>
          <OnboardingSlide
            title="Понятно!"
            icon={<Icon56GestureOutline style={{ color: 'var(--accent)' }} />}
            buttonText="Перейти"
            onClick={end}
          >
            <Caption level="1" weight="regular" style={{ color: '#909499' }}>
              Переходя к сервису, ты соглашаешься с<br />
              <a
                href="https://vk.com/@slangerpub-rules"
                target="_blank"
                style={{ color: '#909499' }}
              >
                Правилами сервиса
              </a>
              .
            </Caption>
          </OnboardingSlide>
        </Gallery>
      </Group>
    </Panel>
  );
};
