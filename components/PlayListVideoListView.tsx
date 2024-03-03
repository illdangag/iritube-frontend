import NextLink from 'next/link';
import {
  Box, Card, CardBody, Text, Image, VStack, HStack, CardHeader, Heading, LinkBox, LinkOverlay, CardProps,
} from '@chakra-ui/react';

import { MdPlayArrow, } from 'react-icons/md';

import { PlayList, Video, } from '@root/interfaces';
import process from 'process';

interface Props extends CardProps {
  playList: PlayList;
  video: Video;
}

const PlayListVideoListView = (props: Props) => {
  const playList: PlayList = props.playList;
  const video: Video = props.video;

  const getCardProps = (): CardProps => {
    const cardProps: Props = {
      ...props,
    };

    delete cardProps.playList;
    delete cardProps.video;

    return cardProps as CardProps;
  };

  const getCurrentVideoIndex = (): number => {
    return playList.videos.findIndex(item => item.videoKey === video.videoKey);
  };

  return <Card paddingBottom='1rem' paddingRight='1rem' {...getCardProps()}>
    <CardHeader>
      <VStack alignItems='flex-start'>
        <Heading fontSize='md'>{playList.title}</Heading>
        <HStack>
          <Text fontSize='xs'>{playList.account.nickname}</Text>
          <Text fontSize='xs' opacity='0.8'>-</Text>
          <Text fontSize='xs' opacity='0.8'>{(getCurrentVideoIndex() + 1) + ' / ' + playList.videos.length}</Text>
        </HStack>
      </VStack>
    </CardHeader>
    <CardBody padding='0' height='100%' overflowY='auto'>
      <VStack width='100%' alignItems='stretch'>
        {playList.videos.map((video, index) => <LinkBox key={index}>
          <HStack gap={0}>
            <VStack width='1.25rem'>
              {getCurrentVideoIndex() === index ? <Text fontSize='xs'><MdPlayArrow width='0.2rem'/></Text> : <Text fontSize='xs'>{index + 1}</Text>}
            </VStack>
            <LinkOverlay as={NextLink} href={`/videos?vk=${video.videoKey}&pk=${playList.playListKey}`}>
              <Box width='4rem' aspectRatio={4 / 3} position='relative' overflow='hidden' borderRadius='md'>
                <Image
                  src={`${process.env.backendURL}/v1/thumbnail/${video.videoKey}`}
                  alt='thumbnail'
                  position='absolute'
                  top='50%' left='50%' transform='translate(-50%, -50%)'
                />
              </Box>
            </LinkOverlay>
            <VStack height='100%' alignItems='flex-start' marginLeft='0.75rem'>
              <LinkOverlay as={NextLink} href={`/videos?vk=${video.videoKey}&pk=${playList.playListKey}`}>
                <Text fontSize='sm' fontWeight={500}>{video.title}</Text>
              </LinkOverlay>
              <Text fontSize='sm' fontWeight={500} opacity={0.6}>{video.account.nickname}</Text>
            </VStack>
          </HStack>
        </LinkBox>)}
      </VStack>
    </CardBody>
  </Card>;
};

export default PlayListVideoListView;
