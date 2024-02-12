import { useEffect, useState, } from 'react';
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
  const [updateDate, setUpdateDate,] = useState<string>('');

  useEffect(() => {
    setUpdateDate(video.getUpdateDate());
  }, []);

  return <Card backgroundColor='none' variant='ghost'>
    <CardBody padding={0}>
      <LinkBox>
        <Box borderRadius='lg' overflow='hidden' backgroundColor='black' aspectRatio='16/9' position='relative'>
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
              {video.getDurationText()}
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

export default VideoView;


