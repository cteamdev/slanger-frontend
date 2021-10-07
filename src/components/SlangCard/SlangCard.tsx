import './SlangCard.css';

import { FC, ImgHTMLAttributes, ReactNode } from 'react';

import {
  Card,
  Caption,
  Title,
  Tappable,
  getClassName,
  usePlatform,
  Platform
} from '@vkontakte/vkui';
import { hasReactNode } from '@vkontakte/vkui/src/lib/utils';
import { HasRef, HasRootRef } from '@vkontakte/vkui/src/types';

export interface SlangCardProps
  extends HasRootRef<HTMLDivElement>,
    ImgHTMLAttributes<HTMLImageElement>,
    HasRef<HTMLImageElement> {
  /**
   Текст над заголовком
   */
  subtitle?: ReactNode;
  /**
   Слово
   */
  word?: ReactNode;
  /**
   Описание
   */
  description?: ReactNode;
  /*
   Кто сделал проект
   */
  creator?: string;
  /*
   Рейтинг
   */
  rating?: number;
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
}

export const SlangCard: FC<SlangCardProps> = (props: SlangCardProps) => {
  const {
    // project props
    subtitle,
    word,
    rating,
    creator,
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
        className="ProjectCard__tappable"
      >
        <div className="ProjectCard__body">
          {hasReactNode(subtitle) && (
            <Caption
              caps
              className="ProjectCard__text"
              weight="semibold"
              level="3"
            >
              {subtitle}
            </Caption>
          )}
          {hasReactNode(word) && hasReactNode(rating) && (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Title weight="semibold" level="3">
                {word}
              </Title>
              <Title weight="semibold" level="3" style={{ color: '#B336FF' }}>
                {rating! > 0 ? `+${rating}` : rating}
              </Title>
            </div>
          )}
          {creator && (
            <Caption
              className="ProjectCard__text ProjectCard__text--secondary"
              weight="regular"
              level="1"
            >
              {creator}
            </Caption>
          )}
          {hasReactNode(description) && (
            <Caption
              className="ProjectCard__description"
              weight="regular"
              level="1"
            >
              {description}
            </Caption>
          )}
        </div>
      </Tappable>
    </Card>
  );
};
