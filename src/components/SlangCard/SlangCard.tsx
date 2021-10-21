import './SlangCard.css';

import type { FC, ImgHTMLAttributes } from 'react';
import {
  Card,
  Caption,
  Title,
  Tappable,
  getClassName,
  usePlatform,
  Platform
} from '@vkontakte/vkui';
import { HasRef, HasRootRef } from '@vkontakte/vkui/src/types';

import { Slang } from '../../types';

export type Props = HasRootRef<HTMLDivElement> &
  ImgHTMLAttributes<HTMLImageElement> &
  HasRef<HTMLImageElement> &
  Omit<Slang, 'id'> & {
    /**
     * Заменяем id на slangId, так как конфликт
     */
    slangId?: number;

    /**
   Максимальная высота изображения
   */
    maxHeight?: number;
    /**
   Аналогично alt для img
   */
    alt?: string;
    /**
   Отключает Tappable у карточки
   */
    disabled?: boolean;
  };

export const SlangCard: FC<Props> = (props: Props) => {
  const {
    slangId,
    // slang props
    word,
    type,
    description,
    // card props
    className,
    style,
    getRootRef,
    ...restProps
  } = props;

  const platform: Platform = usePlatform();

  const disabled: boolean =
    restProps.disabled || typeof restProps.onClick !== 'function';

  return (
    <Card
      mode="outline"
      getRootRef={getRootRef}
      style={style}
      className={getClassName('SlangCard', platform) + (className ?? '')}
    >
      <Tappable
        {...restProps}
        disabled={disabled}
        className="SlangCard__tappable"
      >
        <div className="SlangCard__body">
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Title weight="semibold" level="3">
              {word}
              {slangId && ' | №' + slangId}
            </Title>
          </div>

          <Caption
            className="SlangCard__text SlangCard__text--secondary"
            weight="regular"
            level="1"
          >
            {type}
          </Caption>

          <Caption
            className="SlangCard__description"
            weight="regular"
            level="1"
          >
            {description.length > 120
              ? description.slice(0, 120) + '...'
              : description}
          </Caption>
        </div>
      </Tappable>
    </Card>
  );
};
