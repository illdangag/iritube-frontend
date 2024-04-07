import { useState, ChangeEvent, useEffect, } from 'react';
import {
  Card, CardBody, FormControl, FormLabel, HStack, Input, Radio, RadioGroup, VStack,
  Text, Box, ButtonGroup, Spacer, IconButton,
} from '@chakra-ui/react';
import { MdArrowUpward, MdArrowDownward, MdDeleteOutline, } from 'react-icons/md';
import { VideoThumbnail, } from '@root/components';
import { PlayListVideoDeleteAlert, } from '@root/components/alerts';

import { PlayList, PlayListShare, Video, VideoShare, } from '@root/interfaces';

type Props = {
  playList: PlayList;
  isDisabled?: boolean;
  onChange?: (playList: PlayList) => void;
}

const PlayListEditor = ({
  playList,
  isDisabled = false,
  onChange = () => {},
}: Props) => {
  const [editPlayList, setEditPlayList,] = useState<PlayList>(playList);
  const [deleteVideo, setDeleteVideo,] = useState<Video | null>(playList.videos.length > 0 ? playList.videos[0] : null);
  const [isOpenDeleteVideoAlert, setOpenDeleteVideoAlert,] = useState<boolean>(false);

  useEffect(() => {
    onChange(editPlayList);
  }, [editPlayList,]);

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

  const onClickVideoDelete = (video: Video) => {
    setDeleteVideo(video);
    setOpenDeleteVideoAlert(true);
  };

  const onCloseDeleteAlert = () => {
    setOpenDeleteVideoAlert(false);
  };

  const onConfirmDeleteAlert = () => {
    const videos: Video[] = editPlayList.videos;

    setEditPlayList({
      ...editPlayList,
      videos: videos.filter(video => video.videoKey !== deleteVideo.videoKey),
    });
    setOpenDeleteVideoAlert(false);
  };

  return <>
    <VStack alignItems='stretch'>
      <FormControl>
        <FormLabel>제목</FormLabel>
        <Input type='title' value={editPlayList.title} isDisabled={isDisabled} onChange={onChangeTitle}/>
      </FormControl>
      <FormControl>
        <FormLabel>동영상 목록</FormLabel>
        <Card variant='outline'>
          <CardBody>
            <VStack alignItems='stretch'>
              {editPlayList.videos.map((video, index) => <Box key={index}>
                <Card>
                  <CardBody>
                    <HStack alignItems='stretch'>
                      <Box width='4rem' flexShrink={0}>
                        <VideoThumbnail video={video} aspectRatio={'4/3'} key={'thumbnail-' + index}/>
                      </Box>
                      <VStack justifyContent='space-between' alignItems='start'>
                        <Text fontSize='0.8rem'>{video.title}</Text>
                        <Text fontSize='0.8rem'>{video.account.nickname}</Text>
                      </VStack>
                      <Spacer/>
                      <ButtonGroup variant='outline' size='sm' marginTop='auto'>
                        <IconButton
                          aria-label='previous'
                          variant='ghost'
                          icon={<MdArrowUpward/>}
                          isDisabled={index === 0 || isDisabled}
                          onClick={() => onClickVideoSequencePrevious(video)}
                        />
                        <IconButton
                          aria-label='next'
                          variant='ghost'
                          icon={<MdArrowDownward/>}
                          isDisabled={playList.videos.length === index + 1 || isDisabled}
                          onClick={() => onClickVideoSequenceNext(video)}
                        />
                        <IconButton
                          aria-label='remove'
                          variant='ghost'
                          isDisabled={isDisabled}
                          icon={<MdDeleteOutline/>}
                          onClick={() => onClickVideoDelete(video)}
                        />
                      </ButtonGroup>
                    </HStack>
                  </CardBody>
                </Card>
              </Box>)}
            </VStack>
          </CardBody>
        </Card>
      </FormControl>
      <FormControl>
        <FormLabel>공유</FormLabel>
        <RadioGroup value={editPlayList.share} onChange={onChangeShare} isDisabled={isDisabled}>
          <HStack>
            <Radio value={VideoShare.PUBLIC}>공개</Radio>
            <Radio value={VideoShare.URL}>링크 공유</Radio>
            <Radio value={VideoShare.PRIVATE}>비공개</Radio>
          </HStack>
        </RadioGroup>
      </FormControl>
    </VStack>
    {deleteVideo && <PlayListVideoDeleteAlert
      video={deleteVideo}
      isOpen={isOpenDeleteVideoAlert}
      onClose={onCloseDeleteAlert}
      onConfirm={onConfirmDeleteAlert}
    />}
  </>;
};

export default PlayListEditor;
