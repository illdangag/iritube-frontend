import {} from 'react';
import { GetServerSideProps, } from 'next/types';
import {} from '@chakra-ui/react';

import { EmptyLayout, } from '@root/layouts';
import { VideoPlayer, } from '@root/components'
import { TokenInfo, Video, } from '@root/interfaces';
import iritubeAPI from '@root/utils/iritubeAPI';
import { getTokenInfoByCookies } from '@root/utils';

type Props = {
  video: Video | null,
};

const VideosPage = (props: Props) => {
  const video: Video = Object.assign(new Video(), props.video);

  console.log(video);

  return <EmptyLayout>
    {video && <VideoPlayer video={video}/>}
  </EmptyLayout>;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const tokenInfo: TokenInfo | null = await getTokenInfoByCookies(context);
  const videoKey: string = context.query.key as string;

  try {
    const video: Video = await iritubeAPI.getVideo(tokenInfo, videoKey);
    return {
      props: {
        video: JSON.parse(JSON.stringify(video)),
      },
    };
  } catch {
    return {
      props: {
        video: null,
      }
    }
  }
}

export default VideosPage;