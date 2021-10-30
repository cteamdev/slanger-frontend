import './ShareSlangModal.css';

import type { CSSProperties, FC } from 'react';

import { useRef, useState } from 'react';
import { stripIndents } from 'common-tags';
import { useSetAtomState } from '@mntm/precoil';
import { send } from '@vkontakte/vk-bridge';
import { transition, useHistoryState } from '@unexp/router';
import {
  CellButton,
  Header,
  ModalPage,
  ModalPageHeader,
  PanelHeaderClose,
  ViewWidth
} from '@vkontakte/vkui';
import { Icon28CopyOutline, Icon28WriteOutline } from '@vkontakte/icons';

import { useAdaptivity } from '../../hooks';
import { ImageGrid, ImageGridItem, Skeleton } from '../../components';
import { Slang, SnackbarIconType } from '../../types';
import { delay, uncapitalize } from '../../utils';
import { snackbarAtom } from '../../store';

const waitLoading = (image: HTMLImageElement): Promise<void> =>
  new Promise((resolve) => (image.onload = () => resolve()));

type Props = {
  nav: string;
};

export const ShareSlangModal: FC<Props> = ({ nav }: Props) => {
  const { viewWidth } = useAdaptivity();
  const { id, word, description }: Slang = useHistoryState();

  const setSnackbar = useSetAtomState(snackbarAtom);

  const [loading, setLoading] = useState<boolean>(true);
  const startTime = useRef(Date.now());

  const desktop: boolean = (viewWidth ?? 0) >= ViewWidth.SMALL_TABLET;
  const style: CSSProperties = {
    display: loading ? 'none' : 'block'
  };
  const onLoad = (): void =>
    Date.now() - startTime.current > 20
      ? void setTimeout(() => setLoading(false), 250)
      : setLoading(false);

  const close = (): void => transition(-1);

  const wallShare = async (): Promise<void> => {
    transition(-1);

    await delay(250);
    await send('VKWebAppShowWallPostBox', {
      message: stripIndents`
        [https://vk.com/app7969491#slang?id=${id}|${word}] — ${uncapitalize(
        description
      )}
        
        Хочешь знать больше современных слов? Переходи в [https://vk.com/app7969491|Slanger]!
      `,
      attachments: 'photo-207745347_457239020'
    });
  };

  const chooseStory = async (path: string): Promise<void> => {
    const canvas: HTMLCanvasElement = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1920;

    const sharingStockImage: HTMLImageElement = new Image(1080, 1920);
    sharingStockImage.src = `/${path}-template.png`;
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

  const linkShare = async (): Promise<void> => {
    await send('VKWebAppCopyText', {
      text: 'https://vk.com/app7969491#slang?id=' + id
    });
    transition(-1);

    await delay(200);
    setSnackbar({ icon: SnackbarIconType.SUCCESS, text: 'Успешно' });
  };

  return (
    <ModalPage
      nav={nav}
      onClose={close}
      header={
        <ModalPageHeader
          left={!desktop && <PanelHeaderClose onClick={close} />}
        >
          Поделиться
        </ModalPageHeader>
      }
    >
      <CellButton before={<Icon28CopyOutline />} onClick={linkShare}>
        Скопировать ссылку
      </CellButton>

      <CellButton before={<Icon28WriteOutline />} onClick={wallShare}>
        Поделиться на стене
      </CellButton>

      <Header mode="primary" subtitle="Выберите тип истории">
        Поделиться в истории
      </Header>
      <ImageGrid className="ShareSlangModal__StoryGrid">
        {loading && (
          <>
            <Skeleton style={{ width: 'auto', height: 362.66 }} />
            <Skeleton style={{ width: 'auto', height: 362.66 }} />
          </>
        )}
        <ImageGridItem
          src="/story-light.png"
          className="ShareSlangModal__StoryItem"
          style={style}
          onLoad={onLoad}
          onClick={() => chooseStory('story-light')}
        />
        <ImageGridItem
          src="/story-dark.png"
          className="ShareSlangModal__StoryItem"
          style={style}
          onLoad={onLoad}
          onClick={() => chooseStory('story-dark')}
        />
      </ImageGrid>
    </ModalPage>
  );
};
