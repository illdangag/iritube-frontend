import { useEffect, useState, forwardRef, memo, } from 'react';
import NextLink from 'next/link';
import {
  Badge, Box, Button, ButtonGroup, Card, CardBody, CardFooter, HStack, Link, LinkBox, LinkOverlay, Spacer, Text,
  VStack,
} from '@chakra-ui/react';
import { ThemeTypings, } from '@chakra-ui/styled-system';
import { VideoThumbnail, } from '@root/components/index';

import { Video, VideoShare, VideoState, VideoViewType, } from '@root/interfaces';

type Props = {
  video: Video;
  type?: VideoViewType;
  editable?: boolean;
  onDelete?: () => void;
}

const VideoView = ({
  video,
  type = 'thumbnail',
  editable = false,
  onDelete = () => {},
}: Props, ref) => {
  const [updateDate, setUpdateDate,] = useState<string>('');

  useEffect(() => {
    setUpdateDate(video.getUpdateDate());
  }, [video,]);

  const getThumbnailType = () => {
    return <Card backgroundColor='none' variant='ghost' ref={ref}>
      <CardBody padding={0}>
        <LinkBox>
          <LinkOverlay as={NextLink} href={video.state === VideoState.CONVERTED ? `/videos?vk=${video.videoKey}` : '#'}>
            <VideoThumbnail video={video} aspectRatio={16 / 9} description={video.getDurationText()}/>
          </LinkOverlay>
        </LinkBox>
      </CardBody>
      <CardFooter paddingTop='0.5rem' paddingRight='0' paddingBottom='0' paddingLeft='0'>
        <VStack width='100%' alignItems='start' gap={0.4}>
          <Link as={NextLink} _hover={{ textDecoration: 'none', }} href={video.state === VideoState.CONVERTED ? `/videos?vk=${video.videoKey}` : '#'}>
            <Text as='b'>{video.title}</Text>
          </Link>
          <Link as={NextLink} href={'/accounts/' + video.account.accountKey}>
            <Text fontSize='xs' as='span'>{video.account.nickname}</Text>
          </Link>
          <HStack>
            {getViewCountCreateDate()}
            {video.share !== VideoShare.PUBLIC && <Box>
              {getVideoShareBadge(video.share)}
            </Box>}
          </HStack>
        </VStack>
      </CardFooter>
    </Card>;
  };

  const getVideoShareText = (videoShare: VideoShare) => {
    switch (videoShare) {
      case VideoShare.PRIVATE:
        return '비공개';
      case VideoShare.PUBLIC:
        return '공개';
      case VideoShare.URL:
        return '링크 공유';
    }
  };

  const getVideoShareBadge = (videoShare: VideoShare) => {
    return <Badge colorScheme='gray'>
      {getVideoShareText(videoShare)}
    </Badge>;
  };

  const getViewCountCreateDate = () => {
    return <Box>
      <Text fontSize='xs' as='span'>{'조회수 ' + video.getViewCount()}</Text>
      <Text fontSize='xs' as='span' _before={{
        content: '\"•\"',
        paddingLeft: '0.4rem',
        paddingRight: '0.4rem',
      }}>{updateDate}</Text>
    </Box>;
  };

  const getVideoStateText = (videoState: VideoState) => {
    switch (videoState) {
      case VideoState.EMPTY:
        return '동영상 파일 없음';
      case VideoState.CONVERTED:
        return '변환 완료';
      case VideoState.CONVERTING:
        return '변환중';
      case VideoState.FAIL_CONVERT:
        return '변환 실패';
      case VideoState.UPLOADED:
        return '변환 대기';
    }
  };

  const getVideoStateBadge = (videoState: VideoState) => {
    let colorScheme: ThemeTypings['colorSchemes'] = 'gray';

    if (videoState === VideoState.FAIL_CONVERT) {
      colorScheme = 'red';
    }

    return <Badge variant='solid' colorScheme={colorScheme}>
      {getVideoStateText(videoState)}
    </Badge>;
  };

  const getDetailType = () => {
    return <Card ref={ref}>
      <CardBody>
        <HStack alignItems='stretch'>
          <Box width='10rem' flexShrink='0'>
            <LinkBox>
              <LinkOverlay as={NextLink} href={video.state === VideoState.CONVERTED ? `/videos?vk=${video.videoKey}` : '#'}>
                <VideoThumbnail video={video} aspectRatio={4 / 3} description={video.getDurationText()}/>
              </LinkOverlay>
            </LinkBox>
          </Box>
          <VStack alignItems='start' gap='0' flexGrow='1'>
            <Link as={NextLink} _hover={{ textDecoration: 'none', }} href={video.state === VideoState.CONVERTED ? `/videos?vk=${video.videoKey}` : '#'}>
              <Text as='b'>{video.title}</Text>
            </Link>
            <Text fontSize='small' noOfLines={1} title={video.description}>{video.description}</Text>
            <Link _hover={{ textDecoration: 'none', }} as={NextLink} href={'/accounts/' + video.account.accountKey}>
              <Text fontSize='xs' as='span'>{video.account.nickname}</Text>
            </Link>
            {getViewCountCreateDate()}
            <Spacer/>
            <HStack width='100%'>
              {getVideoShareBadge(video.share)}
              {getVideoStateBadge(video.state)}
              {editable && <>
                <Spacer/>
                <ButtonGroup size='xs' variant='outline' marginTop='auto'>
                  <Button as={NextLink} href={`/channels/videos/${video.videoKey}/edit`}>수정</Button>
                  <Button onClick={onDelete}>삭제</Button>
                </ButtonGroup>
              </>}
            </HStack>
          </VStack>
        </HStack>
      </CardBody>
    </Card>;
  };

  return <>
    {type === 'thumbnail' && getThumbnailType()}
    {type === 'detail' && getDetailType()}
  </>;
};

const equalComparison = (prevProps: Props, nextProps: Props): boolean => {
  return prevProps.video.videoKey === nextProps.video.videoKey;
};

export default memo(forwardRef(VideoView), equalComparison);
