import { useState, } from 'react';
import { GetServerSideProps, } from 'next/types';
import { Box, Card, CardBody, Heading, HStack, VStack, Text, Button, Spacer, } from '@chakra-ui/react';
import { MainLayout, } from '@root/layouts';
import { VideoPlayer, } from '@root/components';
import { MdPlaylistAdd, } from 'react-icons/md';

import { TokenInfo, Video, } from '@root/interfaces';
import iritubeAPI from '@root/utils/iritubeAPI';
import { getTokenInfoByCookies, } from '@root/utils';

type Props = {
  video: Video | null,
};

enum State {
  NOT_EXIST_VIDEO,
  ENABLE_VIDEO,
}

const VideosPage = (props: Props) => {
  const state: State = props.video !== null ? State.ENABLE_VIDEO : State.NOT_EXIST_VIDEO;
  const video: Video = Object.assign(new Video(), props.video);

  const [openAddPlayListAlert, setOpenAddPlayListAlert,] = useState<boolean>(false);

  const onClickAddPlayListButton = () => {
    setOpenAddPlayListAlert(true);
  };

  return <MainLayout>
    <Box>
      {state === State.NOT_EXIST_VIDEO && <Card height='100%' aspectRatio='16/9'>
        <CardBody>
          존재하지 않는 동영상입니다.
        </CardBody>
      </Card>}
      {state === State.ENABLE_VIDEO && <VStack alignItems='flex-start'>
        <VideoPlayer video={video}/>
        <VStack width='100%' alignItems='flex-start'>
          <Heading size='md' marginTop='0.75rem' marginBottom='0.75rem'>{video.title}</Heading>
          <Card width='100%'>
            <CardBody>
              <VStack alignItems='flex-start' gap={0}>
                <HStack width='100%'>
                  <Text fontWeight={700}>{'조회수 ' + video.getViewCount() + ' ' + video.getUpdateDate()}</Text>
                  <Spacer/>
                  <Button size='xs' variant='outline' leftIcon={<MdPlaylistAdd/>} onClick={onClickAddPlayListButton}>재생 목록 추가</Button>
                </HStack>
                <HStack>
                  {video.tags.map((tag, index) => <Text key={index} color='blue.400'>#{tag}</Text>)}
                </HStack>
                <Box marginTop='0.75rem'>
                  <Text>{video.description}</Text>
                </Box>
              </VStack>
            </CardBody>
          </Card>
        </VStack>
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
