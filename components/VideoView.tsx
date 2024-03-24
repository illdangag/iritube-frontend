import { useEffect, useState, forwardRef, memo, } from 'react';
import NextLink from 'next/link';
import {
  Badge, Box, Button, ButtonGroup, Card, CardBody, CardFooter, HStack, Image, Link, LinkBox, LinkOverlay, Spacer, Text,
  VStack,
} from '@chakra-ui/react';
import { ThemeTypings, } from '@chakra-ui/styled-system';

import { TokenInfo, Video, VideoShare, VideoState, VideoViewType, } from '@root/interfaces';
import * as CSS from 'csstype';
import { getTokenInfo, } from '@root/utils';
import iritubeAPI from '@root/utils/iritubeAPI';

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
  const [imageURL, setImageURL,] = useState<string>('/static/images/transparent.png');

  useEffect(() => {
    setUpdateDate(video.getUpdateDate());
    void initThumbnail();
  }, [video,]);

  const initThumbnail = async () => {
    const tokenInfo: TokenInfo | null = await getTokenInfo();
    try {
      const imageData: string = await iritubeAPI.getVideoThumbnail(tokenInfo, video.videoKey);
      setImageURL(imageData);
    } catch (error) {
      setImageURL('/static/images/black.jpg');
    }
  };

  const getVideoThumbnail = (aspectRatio: CSS.Property.AspectRatio) => {
    return <LinkBox>
      <LinkOverlay as={NextLink} href={video.state === VideoState.CONVERTED ? `/videos?vk=${video.videoKey}` : '#'}>
        <Box borderRadius='lg' overflow='hidden' backgroundColor='black' aspectRatio={aspectRatio} position='relative' minWidth='10rem'>
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
            {video.getDurationText()}
          </Text>
        </Box>
      </LinkOverlay>
    </LinkBox>;
  };

  const getThumbnailType = () => {
    return <Card backgroundColor='none' variant='ghost' ref={ref}>
      <CardBody padding={0}>
        {getVideoThumbnail('16/9')}
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
            <Box>
              <Text fontSize='xs' as='span'>{'조회수 ' + video.getViewCount()}</Text>
              <Text fontSize='xs' as='span' _before={{
                content: '\"•\"',
                paddingLeft: '0.4rem',
                paddingRight: '0.4rem',
              }}>{updateDate}</Text>
            </Box>
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
    return <Card ref={ref}>
      <CardBody display='flex' gap='0.5rem'>
        <Box width='10rem'>
          {getVideoThumbnail('4/3')}
        </Box>
        <VStack alignItems='start'>
          <Link as={NextLink} _hover={{ textDecoration: 'none', }} href={video.state === VideoState.CONVERTED ? `/videos?vk=${video.videoKey}` : '#'}>
            <Text as='b'>{video.title}</Text>
          </Link>
          <Text fontSize='small'>{video.description}</Text>
          {!editable && <>
            <Link as={NextLink} href={'/accounts/' + video.account.accountKey}>
              <Text fontSize='xs' as='span'>{video.account.nickname}</Text>
            </Link>
            <HStack>
              <Box>
                <Text fontSize='xs' as='span'>{'조회수 ' + video.getViewCount()}</Text>
                <Text fontSize='xs' as='span' _before={{
                  content: '\"•\"',
                  paddingLeft: '0.4rem',
                  paddingRight: '0.4rem',
                }}>{updateDate}</Text>
              </Box>
              {video.share !== VideoShare.PUBLIC && <Box>
                {getVideoShareBadge(video.share)}
              </Box>}
            </HStack>
          </>}
          {editable && <>
            <HStack>
              {getVideoShareBadge(video.share)}
              {getVideoStateBadge(video.state)}
            </HStack>
            <Spacer/>
            <HStack>
              <ButtonGroup size='xs' variant='outline'>
                <Button as={NextLink} href={`/channels/videos/${video.videoKey}/edit`}>수정</Button>
                <Button onClick={onDelete}>삭제</Button>
              </ButtonGroup>
            </HStack>
          </>}
        </VStack>
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
