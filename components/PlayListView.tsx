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
      position='relative'
    >
      <Box
        position='absolute'
        borderRadius='lg'
        top='0'
        left='50%'
        width='calc(100% - 1rem)'
        height='100%'
        backgroundColor='#fcc41933'
        transform='translate(-50%, 0%)'
      />
      <Box
        marginTop='0.3rem'
        borderRadius='lg'
        overflow='hidden'
        backgroundColor='black'
        aspectRatio='16/9'
        position='relative'
        minWidth='10rem'
      >
        <Image
          src={imageURL}
          alt='thumbnail'
          position='absolute'
          top='50%'
          left='50%'
          transform='translate(-50%, -50%)'
        />
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
