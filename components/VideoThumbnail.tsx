import { memo, useEffect, useState, } from 'react';
import { Box, BoxProps, Image, Text, } from '@chakra-ui/react';

import { TokenInfo, Video, } from '@root/interfaces';
import { getTokenInfo, iritubeAPI, } from '@root/utils';

interface Props extends BoxProps {
  video?: Video;
  description?: string;
}

const VideoThumbnail = (props: Props) => {
  const video: Video | null = props.video || null;
  const description: string = props.description;

  const [imageData, setImageData,] = useState<string>('');
  useEffect(() => {
    void initThumbnailImage();
  }, [video,]);

  const initThumbnailImage = async () => {
    if (video === null) {
      return;
    }
    const tokenInfo: TokenInfo | null = await getTokenInfo();

    try {
      const imageData: string = await iritubeAPI.getVideoThumbnail(tokenInfo, video.videoKey);
      setImageData(imageData);
    } catch {
    }
  };

  return <Box position='relative' overflow='hidden' borderRadius='md' backgroundColor='#00000066' {...props}>
    {imageData !== '' && <Image
      src={imageData}
      position='absolute'
      top='50%'
      left='50%'
      transform='translate(-50%, -50%)'
    />}
    {description && <Text
      as='b'
      position='absolute'
      right='0.2rem'
      bottom='0.2rem'
      paddingLeft='0.2rem'
      paddingRight='0.2rem'
      borderRadius='0.2rem'
      backgroundColor='#00000055'
      fontSize='xs'
    >
      {description}
    </Text>}
  </Box>;
};

export default memo(VideoThumbnail, (prevProps: Props, nextProps: Props) => {
  if (!nextProps.video || !nextProps.video) {
    return false;
  }

  return prevProps.video.videoKey === nextProps.video.videoKey && prevProps.description === nextProps.description;
}) ;
