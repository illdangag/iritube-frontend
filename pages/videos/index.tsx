import { GetServerSideProps, } from 'next/types';
import { Box, Card, CardBody, Input, VStack, } from '@chakra-ui/react';
import { MainLayout, } from '@root/layouts';
import { VideoPlayer, } from '@root/components';

import { TokenInfo, Video, } from '@root/interfaces';
import iritubeAPI from '@root/utils/iritubeAPI';
import { getTokenInfoByCookies, } from '@root/utils';

type Props = {
  video: Video | null,
};

enum State {
  NOT_EXIST_VIDEO = 'NOT_EXIST_VIDEO',
  ENABLE_VIDEO = 'ENABLE_VIDEO',
}

const VideosPage = (props: Props) => {
  const state: State = props.video !== null ? State.ENABLE_VIDEO : State.NOT_EXIST_VIDEO;

  const video: Video = Object.assign(new Video(), props.video);

  return <MainLayout>
    <Box>
      {state === State.NOT_EXIST_VIDEO && <Card height='100%' aspectRatio='16/9'>
        <CardBody>
          존재하지 않는 동영상입니다.
        </CardBody>
      </Card>}
      {state === State.ENABLE_VIDEO && <VStack>
        <VideoPlayer video={video}/>
        <Box width='100%' onKeyUp={(event) => event.stopPropagation()}>
          <Input/>
        </Box>
      </VStack>}
    </Box>
  </MainLayout>;
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
      },
    };
  }
};

export default VideosPage;
