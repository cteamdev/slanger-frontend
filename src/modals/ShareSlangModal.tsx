import { CSSProperties, FC, useRef, useState } from 'react';
import { send } from '@vkontakte/vk-bridge';
import { transition, useHistoryState } from '@unexp/router';
import {
  ModalPage,
  ModalPageHeader,
  PanelHeaderClose,
  useAdaptivity,
  ViewWidth
} from '@vkontakte/vkui';
import { ImageGrid, ImageGridItem, Skeleton } from '../components';
import { Slang } from '../types';

const waitLoading = (image: HTMLImageElement): Promise<void> =>
  new Promise((resolve) => (image.onload = () => resolve()));

type Props = {
  nav: string;
};

export const ShareSlangModal: FC<Props> = ({ nav }: Props) => {
  const { viewWidth } = useAdaptivity();
  const { id, word, description }: Slang = useHistoryState();

  const [loading, setLoading] = useState<boolean>(true);
  const startTime = useRef(Date.now());

  const desktop: boolean = (viewWidth ?? 0) >= ViewWidth.SMALL_TABLET;
  const style: CSSProperties = {
    display: loading ? 'none' : 'block',
    cursor: 'pointer'
  };
  const onLoad = () =>
    Date.now() - startTime.current > 20
      ? setTimeout(() => setLoading(false), 250)
      : setLoading(false);

  const close = () => transition(-1);
  const choose = async (path: string) => {
    const canvas: HTMLCanvasElement = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1920;

    const sharingStockImage: HTMLImageElement = new Image(1080, 1920);
    sharingStockImage.src = `/src/assets/${path}-template.png`;
    sharingStockImage.crossOrigin = 'anonymous';
    await waitLoading(sharingStockImage);

    const context: CanvasRenderingContext2D | null = canvas.getContext('2d');
    if (!context) return;

    context.drawImage(sharingStockImage, 0, 0);

    context.fillStyle = '#fff';
    context.font = 'normal 700 80px Manrope, sans-serif';
    context.textAlign = 'center';
    context.textBaseline = 'middle';

    context.fillText(
      (word.length > 18 ? word.slice(0, 18) + '...' : word) + ' —',
      canvas.width / 2,
      768
    );

    context.font = 'normal 400 50px Manrope, sans-serif';

    const lines: string[] = (
      description.length > 216 ? description.slice(0, 216) + '...' : description
    )
      .replace(/(?![^\n]{1,36}$)([^\n]{1,32})\s/g, '$1\n')
      .split('\n');
    for (const [index, line] of lines.entries())
      context.fillText(line, canvas.width / 2, 858 + 70 * index, 900);

    transition(-1);
    await send('VKWebAppShowStoryBox', {
      background_type: 'image',
      blob: canvas.toDataURL(),
      locked: true,
      attachment: {
        text: 'go_to',
        type: 'url',
        url: 'https://vk.com/app7969491#slang?id=' + id
      }
    });
  };

  return (
    <ModalPage
      nav={nav}
      onClose={close}
      header={
        <ModalPageHeader
          left={!desktop && <PanelHeaderClose onClick={close} />}
        >
          Тип истории
        </ModalPageHeader>
      }
    >
      <ImageGrid>
        {loading && (
          <>
            <Skeleton style={{ width: 'auto', height: 362.66 }} />
            <Skeleton style={{ width: 'auto', height: 362.66 }} />
          </>
        )}
        <ImageGridItem
          src="/src/assets/story-light.png"
          style={style}
          onLoad={onLoad}
          onClick={() => choose('story-light')}
        />
        <ImageGridItem
          src="/src/assets/story-dark.png"
          style={style}
          onLoad={onLoad}
          onClick={() => choose('story-dark')}
        />
      </ImageGrid>
    </ModalPage>
  );
};
