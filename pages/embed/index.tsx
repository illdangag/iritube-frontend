import {} from 'react';
import { GetServerSideProps, } from 'next/types';
import { Box, } from '@chakra-ui/react';
import { VideoPlayer, } from '@root/components';

import { TokenInfo, Video, } from '@root/interfaces';
import { getTokenInfoByCookies, iritubeAPI, } from '@root/utils';

type Props = {
  video: Video | null,
};

const EmbedPage = (props: Props) => {
  const video: Video | null = props.video ? Video.getInstance(props.video) : null;

  return (<Box height='100vh'>
    <VideoPlayer video={video} isRounded={false}/>
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
  } else {
    try {
      video = await iritubeAPI.getVideo(tokenInfo, videoKey);
    } catch (error) {
      console.error(error);
    }

    return {
      props: {
        video: JSON.parse(JSON.stringify(video)),
      },
    };
  }
};

export default EmbedPage;
