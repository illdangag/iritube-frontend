import { useEffect, useState, } from 'react';
import NextLink from 'next/link';
import {
  Badge, Box, Button, ButtonGroup, Card, CardBody, CardFooter, HStack, Image, Link, LinkBox, LinkOverlay, Spacer, Text,
  VStack,
} from '@chakra-ui/react';
import { ThemeTypings, } from '@chakra-ui/styled-system';

import { Video, VideoShare, VideoState, VideoViewType, } from '@root/interfaces';
import * as CSS from 'csstype';
import process from 'process';

type Props = {
  video: Video,
  type?: VideoViewType,
}

const VideoView = ({
  video,
  type = 'thumbnail',
}: Props) => {
  const [updateDate, setUpdateDate,] = useState<string>('');

  useEffect(() => {
    setUpdateDate(video.getUpdateDate());
  }, []);

  const getVideoThumbnail = (aspectRatio: CSS.Property.AspectRatio) => {
    return <LinkBox>
      <Box borderRadius='lg' overflow='hidden' backgroundColor='black' aspectRatio={aspectRatio} position='relative' minWidth='10rem'>
        <LinkOverlay as={NextLink} href={video.state === VideoState.CONVERTED ? `/videos?key=${video.videoKey}` : '#'}>
          <Image
            src={video.state === VideoState.CONVERTED ? `${process.env.backendURL}/v1/thumbnail/${video.videoKey}` : '/static/images/question-mark.png'}
            alt='thumbnail'
            position='absolute'
            top='50%' left='50%' transform='translate(-50%, -50%)'
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
            {video.getDurationText()}
          </Text>
        </LinkOverlay>
      </Box>
    </LinkBox>;
  };

  const getThumbnailType = () => {
    return <Card backgroundColor='none' variant='ghost'>
      <CardBody padding={0}>
        {getVideoThumbnail('16/9')}
      </CardBody>
      <CardFooter paddingTop='0.5rem' paddingRight='0' paddingBottom='0' paddingLeft='0'>
        <VStack width='100%' alignItems='start' gap={0.4}>
          <Link as={NextLink} _hover={{ textDecoration: 'none', }} href={video.state === VideoState.CONVERTED ? `/videos?key=${video.videoKey}` : '#'}>
            <Text as='b'>{video.title}</Text>
          </Link>
          <Text fontSize='xs' as='span'>{video.account.nickname}</Text>
          <HStack gap={0}>
            <Text fontSize='xs' as='span'>{'조회수 ' + video.getViewCount()}</Text>
            <Text fontSize='xs' as='span' _before={{
              content: '\"•\"',
              paddingLeft: '0.4rem',
              paddingRight: '0.4rem',
            }}>{updateDate}</Text>
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

    return <Badge
      variant='solid'
      colorScheme={colorScheme}
    >
      {getVideoStateText(videoState)}
    </Badge>;
  };

  const getDetailType = () => {
    return <Card>
      <CardBody display='flex' gap='0.5rem'>
        <Box width='10rem'>
          {getVideoThumbnail('4/3')}
        </Box>
        <VStack alignItems='start'>
          <Link as={NextLink} _hover={{ textDecoration: 'none', }} href={video.state === VideoState.CONVERTED ? `/videos?key=${video.videoKey}` : '#'}>
            <Text as='b'>{video.title}</Text>
          </Link>
          <Text fontSize='small'>{video.description}</Text>
          <HStack>
            {getVideoShareBadge(video.share)}
            {getVideoStateBadge(video.state)}
          </HStack>
          <Spacer/>
          <HStack>
            <ButtonGroup size='xs' isAttached variant='outline'>
              <Button as={NextLink} href={`/accounts/videos/${video.videoKey}/edit`}>수정</Button>
              <Button as={NextLink} href='#'>삭제</Button>
            </ButtonGroup>
          </HStack>
        </VStack>
      </CardBody>
    </Card>;
  };

  return <>
    {type === 'thumbnail' && getThumbnailType()}
    {type === 'detail' && getDetailType()}
  </>;
};

export default VideoView;


