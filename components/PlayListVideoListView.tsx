import { useEffect, useState, } from 'react';
import NextLink from 'next/link';
import {
  Box, Card, CardBody, CardHeader, CardProps, Heading, HStack, Image, LinkBox, LinkOverlay, Text, VStack,
} from '@chakra-ui/react';
import { MdPlayArrow, } from 'react-icons/md';

import { PlayList, TokenInfo, Video, VideoShare, } from '@root/interfaces';
import iritubeAPI from '@root/utils/iritubeAPI';
import { getTokenInfo, } from '@root/utils';

interface Props extends CardProps {
  playList: PlayList;
  // video: Video;
  videoKey: string;
}

type ThumbnailData = {
  videoKey: string;
  data: string;
};

const PlayListVideoListView = (props: Props) => {
  const playList: PlayList = props.playList;
  // const video: Video = props.video;
  const videoKey: string = props.videoKey;

  const [thumbnailMap, setThumbnailMap,] = useState<Map<string, string>>(new Map());

  useEffect(() => {
    void initThumbnail();
  }, [playList,]);

  const initThumbnail = async () => {
    const tokenInfo: TokenInfo | null = await getTokenInfo();
    const promiseQueue: Promise<ThumbnailData>[] = [];

    for (let playListVideo of playList.videos) {
      promiseQueue.push(new Promise<ThumbnailData>(async (resolve, reject) => {
        try {
          const file: File = await iritubeAPI.getVideoThumbnail(tokenInfo, playListVideo.videoKey);
          const fileReader: FileReader = new FileReader();
          fileReader.addEventListener('load', (event) => {
            const result: string = event.target.result as string;
            resolve({
              videoKey: playListVideo.videoKey,
              data: result,
            } as ThumbnailData);
          });
          fileReader.readAsDataURL(file);
        } catch (error) {
          resolve({
            videoKey: playListVideo.videoKey,
            data: '/static/images/transparent.png',
          } as ThumbnailData);
        }
      }));
    }

    const promiseResult: ThumbnailData[] = await Promise.all(promiseQueue);

    const newThumbnailMap: Map<string, string> = new Map<string, string>();
    promiseResult.forEach(value => {
      newThumbnailMap.set(value.videoKey, value.data);
    });

    setThumbnailMap(newThumbnailMap);
  };

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
            <LinkOverlay as={NextLink} href={`/videos?vk=${playListVideo.videoKey}&pk=${playList.playListKey}`}>
              <Box width='4rem' aspectRatio={4 / 3} position='relative' overflow='hidden' borderRadius='md'>
                <Image
                  src={thumbnailMap && thumbnailMap.get(playListVideo.videoKey) || '/static/images/transparent.png'}
                  alt='thumbnail'
                  position='absolute'
                  top='50%' left='50%' transform='translate(-50%, -50%)'
                />
              </Box>
            </LinkOverlay>
            <VStack height='100%' alignItems='flex-start' marginLeft='0.75rem'>
              <LinkOverlay as={NextLink} href={`/videos?vk=${playListVideo.videoKey}&pk=${playList.playListKey}`}>
                <Text fontSize='sm' fontWeight={500}>{playListVideo.share === VideoShare.PRIVATE ? '비공개 동영상' : playListVideo.title}</Text>
              </LinkOverlay>
              <Text fontSize='sm' fontWeight={500} opacity={0.6}>{playListVideo.account ? playListVideo.account.nickname : ''}</Text>
            </VStack>
          </HStack>
        </LinkBox>)}
      </VStack>
    </CardBody>
  </Card>;
};

export default PlayListVideoListView;
