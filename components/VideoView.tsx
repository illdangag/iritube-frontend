import React from 'react';
import NextLink from 'next/link';
import {
  Box, Card, CardBody, CardFooter, Text, Image, LinkBox, LinkOverlay, Link, HStack, VStack,
} from '@chakra-ui/react';

import { Video, } from '@root/interfaces';
import process from 'process';

type Props = {
  video: Video,
}

const VideoView = ({
  video,
}: Props) => {
  const getViewCount = (video: Video): string => {
    return new Intl.NumberFormat('ko-KR', {
      notation: 'compact',
    }).format(video.viewCount);
  };

  const getUploadDate = (video: Video): string => {
    const now: number = new Date().getTime();

    let ago: number = (video.createDate - now) / 1000;
    let unit: Intl.RelativeTimeFormatUnit;

    if ((ago * -1) < 60) {
      return '조금 전';
    } else if ((ago * -1) < 60 * 60) {
      ago = ago / (60);
      unit = 'minute';
    } else if ((ago * -1) < 60 * 60 * 24) {
      ago = ago / (60 * 60);
      unit = 'hour';
    } else if ((ago * -1) < 60 * 60 * 24 * 30) {
      ago = ago / (60 * 60 * 24);
      unit = 'day';
    } else if ((ago * -1) < 60 * 60 * 24 * 30 * 12) {
      ago = ago / (60 * 60 * 24 * 30);
      unit = 'month';
    } else { // 몇개월 전
      ago = ago / (60 * 60 * 24 * 30 * 12);
      unit = 'year';
    }

    return new Intl.RelativeTimeFormat('ko-KR').format(Math.round(ago), unit);
  };

  const getDuration = (video: Video): string => {
    let duration: number = Math.floor(video.duration);

    const hour: number = Math.floor(duration / 3600);
    const minute: number = Math.floor((duration - hour * 3600) / 60);
    const second: number = Math.floor((duration - hour * 3600 - minute * 60))

    let result: string = '';

    if (hour > 0) {
      result = hour + ':';
    }

    return result + String(minute).padStart(2, '0') + ':' + String(second).padStart(2, '0');
  };

  return <Card backgroundColor='none'>
    <CardBody padding={0}>
      <LinkBox>
        <Box borderRadius='0.375rem' overflow='hidden' backgroundColor='black' aspectRatio='16/9' position='relative'>
          <LinkOverlay as={NextLink} href={`/videos?key=${video.videoKey}`}>
            <Image
              src={`${process.env.backendURL}/v1/thumbnail/${video.videoKey}`}
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
              {getDuration(video)}
            </Text>
          </LinkOverlay>
        </Box>
      </LinkBox>
    </CardBody>
    <CardFooter paddingTop='0.5rem' paddingRight='0' paddingBottom='0' paddingLeft='0'>
      <VStack width='100%' alignItems='start' gap={0.4}>
        <Link as={NextLink} _hover={{ textDecoration: 'none', }} href={`/videos?key=${video.videoKey}`}>
          <Text as='b'>{video.title}</Text>
        </Link>
        <Text fontSize='xs' as='span'>{video.account.nickname}</Text>
        <HStack gap={0}>
          <Text fontSize='xs' as='span'>{'조회수 ' + getViewCount(video) + '회'}</Text>
          <Text fontSize='xs' as='span' _before={{
            content: '\"•\"',
            paddingLeft: '0.4rem',
            paddingRight: '0.4rem',
          }}>{getUploadDate(video)}</Text>
        </HStack>
      </VStack>
    </CardFooter>
  </Card>;
};

export default VideoView;


