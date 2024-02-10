import React from 'react';
import NextLink from 'next/link';
import { Box, Card, CardBody, CardFooter, Text, Image, LinkBox, LinkOverlay, } from '@chakra-ui/react';

import { Video, } from '@root/interfaces';
import process from 'process';

type Props = {
  video: Video,
}

const VideoView = ({
  video,
}: Props) => {
  return <LinkBox>
    <Card>
      <CardBody>
        <Box borderRadius='0.4rem' overflow='hidden' backgroundColor='black' aspectRatio='16/9' position='relative'>
          <Image
            src={`${process.env.backendURL}/v1/thumbnail/${video.videoKey}`}
            alt='thumbnail'
            position='absolute'
            top='50%' left='50%' transform='translate(-50%, -50%)'
          />
        </Box>
      </CardBody>
      <CardFooter paddingTop='0'>
        <LinkOverlay as={NextLink} href={`/videos?key=${video.videoKey}`}>
          <Text>{video.title}</Text>
        </LinkOverlay>
      </CardFooter>
    </Card>
  </LinkBox>;
};

export default VideoView;


