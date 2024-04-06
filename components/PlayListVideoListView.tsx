import NextLink from 'next/link';
import {
  Card, CardBody, CardHeader, CardProps, Heading, HStack, LinkBox, LinkOverlay, Text, VStack,
} from '@chakra-ui/react';
import { MdPlayArrow, } from 'react-icons/md';

import { PlayList, VideoShare, } from '@root/interfaces';
import { VideoThumbnail, } from '@root/components/index';

interface Props extends CardProps {
  playList: PlayList;
  videoKey: string;
}

const PlayListVideoListView = (props: Props) => {
  const playList: PlayList = props.playList;
  const videoKey: string = props.videoKey;

  const getCardProps = (): CardProps => {
    const cardProps: Props = {
      ...props,
    };

    delete cardProps.playList;
    delete cardProps.videoKey;

    return cardProps as CardProps;
  };

  const getCurrentVideoIndex = (): number => {
    return playList.videos.findIndex(item => item.videoKey === videoKey);
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
        {playList.videos.map((playListVideo, index) => <LinkBox key={index}>
          <HStack gap={0}>
            <VStack width='1.25rem'>
              {videoKey === playListVideo.videoKey ? <Text fontSize='xs'><MdPlayArrow width='0.2rem'/></Text> : <Text fontSize='xs'>{index + 1}</Text>}
            </VStack>
            {!playListVideo.id && <VideoThumbnail video={playListVideo} aspectRatio='4/3' width='4rem'/>}
            {playListVideo.id && <LinkOverlay as={NextLink} href={`/videos?vk=${playListVideo.videoKey}&pk=${playList.playListKey}`}>
              <VideoThumbnail video={playListVideo} aspectRatio='4/3' width='4rem'/>
            </LinkOverlay>}
            <VStack height='100%' alignItems='flex-start' marginLeft='0.75rem'>
              {playListVideo.deleted && <Text fontSize='sm' fontWeight={500}>삭제된 동영상</Text>}
              {!playListVideo.id && playListVideo.share === VideoShare.PRIVATE && <Text fontSize='sm' fontWeight={500}>비공개 동영상</Text>}
              {playListVideo.id && <LinkOverlay as={NextLink} href={`/videos?vk=${playListVideo.videoKey}&pk=${playList.playListKey}`}>
                <Text fontSize='sm' fontWeight={500}>{playListVideo.title}</Text>
              </LinkOverlay>}
              <Text fontSize='sm' fontWeight={500} opacity={0.6}>{playListVideo.account ? playListVideo.account.nickname : ''}</Text>
            </VStack>
          </HStack>
        </LinkBox>)}
      </VStack>
    </CardBody>
  </Card>;
};

export default PlayListVideoListView;
