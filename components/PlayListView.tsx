import { forwardRef, memo, useEffect, useState, } from 'react';
import { Box, Card, CardBody, CardFooter, Image, LinkBox, Text, } from '@chakra-ui/react';

import { PlayList, TokenInfo, Video, VideoShare, } from '@root/interfaces';
import { getTokenInfo, iritubeAPI, } from '@root/utils';

type Props = {
  playList: PlayList;
}

const PlayListView = ({
  playList,
}: Props, ref) => {
  const [imageURL, setImageURL,] = useState<string>('/static/images/transparent.png');

  useEffect(() => {
    const thumbnailVideo: Video | undefined = playList.videos.find(video => video.share === VideoShare.PUBLIC);

    if (thumbnailVideo) {
      void initThumbnail(thumbnailVideo);
    } else {
      setImageURL('/static/images/black.jpg');
    }
  }, [playList,]);

  const initThumbnail = async (video: Video) => {
    const tokenInfo: TokenInfo | null = await getTokenInfo();
    try {
      const imageData: string = await iritubeAPI.getVideoThumbnail(tokenInfo, video.videoKey);
      setImageURL(imageData);
    } catch (error) {
      setImageURL('/static/images/black.jpg');
    }
  };

  return <Card ref={ref} backgroundColor='none' variant='ghost'>
    <CardBody
      padding='0'
      aspectRatio='16/9'
      overflow='hidden'
      borderRadius='lg'
    >
      <Box
        borderRadius='lg'
        aspectRatio='16/9'
        position='relative'
      >
        <Image
          src={imageURL}
          alt='thumbnail'
          position='absolute'
          top='50%'
          left='50%'
          transform='translate(-50%, -50%)'
        />
        <Text
          as='b'
          position='absolute'
          right='0.2rem'
          bottom='0.2rem'
          paddingLeft='0.2rem'
          paddingRight='0.2rem'
          borderRadius='0.2rem'
          backgroundColor='#00000044'
          fontSize='xs'
        >
          동영상 {playList.videos.length}개
        </Text>
      </Box>
    </CardBody>
    <CardFooter paddingTop='0.5rem' paddingRight='0' paddingBottom='0' paddingLeft='0'>
      <Text as='b'>{playList.title}</Text>
    </CardFooter>
  </Card>;
};
const equalComparison = (prevProps: Props, nextProps: Props): boolean => {
  return prevProps.playList.playListKey === nextProps.playList.playListKey;
};

export default memo(forwardRef(PlayListView), equalComparison);
