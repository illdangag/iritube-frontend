import {} from 'react';
import { GetServerSideProps, } from 'next/types';
import { Box, Text, } from '@chakra-ui/react';
import { VideoPlayer, } from '@root/components';

import { TokenInfo, Video, } from '@root/interfaces';
import { getTokenInfoByCookies, iritubeAPI, } from '@root/utils';

type Props = {
  video: Video | null,
};

const EmbedPage = (props: Props) => {
  const video: Video | null = props.video ? Video.getInstance(props.video) : null;

  return (<Box height='100vh'>
    {(!video || !video.id) && <Box padding='1rem'>
      <Text>동영상이 존재하지 않습니다</Text>
    </Box>}
    {video && video.id && <VideoPlayer video={video} isRounded={false}/>}
  </Box>);
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const tokenInfo: TokenInfo | null = await getTokenInfoByCookies(context);
  const videoKey: string | null = context.query.vk ? context.query.vk as string : null;

  let video: Video | null = null;

  if (!videoKey) {
    return {
      props: {
        video: null,
      },
    };
  }

  try {
    video = await iritubeAPI.getVideo(tokenInfo, videoKey);
  } catch {
    video = null;
  }

  if (video) {
    return {
      props: {
        video: JSON.parse(JSON.stringify(video)),
      },
    };
  } else {
    return {
      props: {
        video: null,
      },
    };
  }
};

export default EmbedPage;
