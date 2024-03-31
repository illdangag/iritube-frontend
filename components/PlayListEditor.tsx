import { useState, ChangeEvent, useEffect, } from 'react';
import {
  Card, CardBody, FormControl, FormLabel, HStack, Input, Radio, RadioGroup, VStack,
  Text, Box, Image, ButtonGroup, Button, Spacer,
} from '@chakra-ui/react';

import { PlayList, PlayListShare, TokenInfo, Video, VideoShare, } from '@root/interfaces';
import { getTokenInfo, } from '@root/utils';
import iritubeAPI from '@root/utils/iritubeAPI';

type Props = {
  playList: PlayList;
  onChange?: (playList: PlayList) => void;
}

type ThumbnailData = {
  videoKey: string;
  data: string;
};

const PlayListEditor = ({
  playList,
  onChange = () => {},
}: Props) => {
  const [editPlayList, setEditPlayList,] = useState<PlayList>(playList);
  const [thumbnailMap, setThumbnailMap,] = useState<Map<string, string>>(new Map());

  useEffect(() => {
    void initThumbnail();
  }, [ playList, ]);

  useEffect(() => {
    onChange(editPlayList);
  }, [editPlayList,]);

  const initThumbnail = async () => {
    const tokenInfo: TokenInfo | null = await getTokenInfo();
    const promiseQueue: Promise<ThumbnailData>[] = [];

    for (let playListVideo of editPlayList.videos) {
      promiseQueue.push(new Promise<ThumbnailData>(async (resolve) => {
        if (playListVideo.deleted) {
          resolve({
            videoKey: playListVideo.videoKey,
            data: '/static/images/black.jpg',
          } as ThumbnailData);
        } else {
          try {
            const imageData: string = await iritubeAPI.getVideoThumbnail(tokenInfo, playListVideo.videoKey);
            resolve({
              videoKey: playListVideo.videoKey,
              data: imageData,
            } as ThumbnailData);
          } catch (error) {
            resolve({
              videoKey: playListVideo.videoKey,
              data: '/static/images/black.jpg',
            } as ThumbnailData);
          }
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

  const onChangeTitle = (event: ChangeEvent<HTMLInputElement>) => {
    setEditPlayList({
      ...editPlayList,
      title: event.target.value,
    } as PlayList);
  };

  const onChangeShare = (share: PlayListShare) => {
    setEditPlayList({
      ...editPlayList,
      share: share,
    } as PlayList);
  };

  const onClickVideoSequencePrevious = (video: Video) => {
    const videos: Video[] = editPlayList.videos;
    const index = videos.indexOf(video);
    [videos[index - 1], videos[index],] = [videos[index], videos[index - 1],];

    setEditPlayList({
      ...editPlayList,
      videos,
    } as PlayList);
  };

  const onClickVideoSequenceNext = (video: Video) => {
    const videos: Video[] = editPlayList.videos;
    const index = videos.indexOf(video);
    [videos[index + 1], videos[index],] = [videos[index], videos[index + 1],];

    setEditPlayList({
      ...editPlayList,
      videos,
    } as PlayList);
  };

  const getVideoThumbnailElement = (videoKey: string) => {
    return <Box aspectRatio={'4/3'} position='relative' overflow='hidden' borderRadius='md'>
      <Image
        src={thumbnailMap && thumbnailMap.get(videoKey) || '/static/images/black.jpg'}
        alt='thumbnail'
        position='absolute'
        top='50%' left='50%' transform='translate(-50%, -50%)'
      />
    </Box>;
  };

  return <VStack alignItems='stretch'>
    <FormControl>
      <FormLabel>제목</FormLabel>
      <Input type='title' value={editPlayList.title} onChange={onChangeTitle}/>
    </FormControl>
    <FormControl>
      <FormLabel>동영상 목록</FormLabel>
      <Card variant='outline'>
        <CardBody>
          <VStack alignItems='stretch'>
            {editPlayList.videos.map((video, index) => <Card key={index}>
              <CardBody>
                <HStack alignItems='stretch'>
                  <Box width='4rem' flexShrink={0}>
                    {getVideoThumbnailElement(video.videoKey)}
                  </Box>
                  <VStack justifyContent='space-between' alignItems='start'>
                    <Text fontSize='0.8rem'>{video.title}</Text>
                    <Text fontSize='0.8rem'>{video.account.nickname}</Text>
                  </VStack>
                  <Spacer/>
                  <ButtonGroup variant='outline' size='xs' marginTop='auto'>
                    <Button
                      isDisabled={index === 0}
                      onClick={() => onClickVideoSequencePrevious(video)}
                    >
                      위로
                    </Button>
                    <Button
                      isDisabled={playList.videos.length === index + 1}
                      onClick={() => onClickVideoSequenceNext(video)}
                    >
                      아래로
                    </Button>
                    <Button>삭제</Button>
                  </ButtonGroup>
                </HStack>
              </CardBody>
            </Card>)}
          </VStack>
        </CardBody>
      </Card>
    </FormControl>
    <FormControl>
      <FormLabel>공유</FormLabel>
      <RadioGroup value={editPlayList.share} onChange={onChangeShare}>
        <HStack>
          <Radio value={VideoShare.PUBLIC}>공개</Radio>
          <Radio value={VideoShare.URL}>링크 공유</Radio>
          <Radio value={VideoShare.PRIVATE}>비공개</Radio>
        </HStack>
      </RadioGroup>
    </FormControl>
  </VStack>;
};

export default PlayListEditor;
