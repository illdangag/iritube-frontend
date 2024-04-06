import { memo, useEffect, useState, } from 'react';
import { Box, Image, } from '@chakra-ui/react';

import { TokenInfo, Video, } from '@root/interfaces';
import { getTokenInfo, iritubeAPI, } from '@root/utils';
import * as CSS from 'csstype';

type Props = {
  video: Video;
  aspectRatio?: CSS.Property.AspectRatio;
  description?: string;
}

const BLACK_IMAGE: string = '/static/images/black.jpg';
const TRANSPARENT_IMAGE: string = '/static/images/transparent.png';

const VideoThumbnail = ({
  video,
  aspectRatio = '4/3',
  description = '',
}: Props) => {
  const [imageData, setImageData,] = useState<string>(TRANSPARENT_IMAGE);
  useEffect(() => {
    void initThumbnailImage();
  }, [video,]);

  const initThumbnailImage = async () => {
    const tokenInfo: TokenInfo | null = await getTokenInfo();

    try {
      const imageData: string = await iritubeAPI.getVideoThumbnail(tokenInfo, video.videoKey);
      setImageData(imageData);
    } catch {
      setImageData(BLACK_IMAGE);
    }
  };

  return <Box aspectRatio={aspectRatio} position='relative' overflow='hidden' borderRadius='md'>
    <Image
      src={imageData}
      alt={video.videoKey}
      position='absolute'
      top='50%'
      left='50%'
      transform='translate(-50%, -50%)'
    />
  </Box>;
};

export default memo(VideoThumbnail, (prevProps: Props, nextProps: Props) => {
  return prevProps.video.videoKey === nextProps.video.videoKey && prevProps.description === nextProps.description;
}) ;
