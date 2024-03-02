import { useState, useEffect, useRef, } from 'react';
import { GetServerSideProps, } from 'next/types';
import { Box, Card, CardBody, Heading, HStack, VStack, Text, Button, Spacer, Flex, } from '@chakra-ui/react';
import { MainLayout, } from '@root/layouts';
import { VideoPlayer, PlayListVideoListView, } from '@root/components';
import { PlayListVideoAddAlert, } from '@root/components/alerts';
import { MdPlaylistAdd, } from 'react-icons/md';

import { PlayList, TokenInfo, Video, } from '@root/interfaces';
import iritubeAPI from '@root/utils/iritubeAPI';
import { getTokenInfoByCookies, } from '@root/utils';
import { throttle, } from 'lodash';

type Props = {
  states: State[],
  video: Video | null,
  playList: PlayList | null,
};

enum State {
  NOT_EXIST_VIDEO,
  NOT_EXIST_PLAY_LIST,
}

const VideosPage = (props: Props) => {
  const stateList: State[] = props.states;
  const video: Video = Object.assign(new Video(), props.video);
  const playList: PlayList | null = props.playList;

  const videoRef = useRef<HTMLDivElement>(null);
  const [openAddPlayListAlert, setOpenAddPlayListAlert,] = useState<boolean>(false);
  const [videoPlayerHeight, setVideoPlayerHeight,] = useState<number>(-1);

  useEffect(() => {
    const windowResizeCallback = throttle(() => {
      setVideoPlayerHeight(videoRef.current.offsetHeight);
    }, 100);

    windowResizeCallback();
    window.addEventListener('resize', windowResizeCallback);

    return () => {
      window.removeEventListener('resize', windowResizeCallback);
    };
  }, []);

  const onClickAddPlayListButton = () => {
    setOpenAddPlayListAlert(true);
  };

  const onClosePlayListVideoAddAlert = () => {
    setOpenAddPlayListAlert(false);
  };

  const onConfirmPlayListVideoAddAlert = () => {
    setOpenAddPlayListAlert(false);
  };

  return <MainLayout>
    <Box>
      {stateList.indexOf(State.NOT_EXIST_VIDEO) > -1 && <Card height='100%' aspectRatio='16/9'>
        <CardBody>
          존재하지 않는 동영상입니다.
        </CardBody>
      </Card>}
      {stateList.indexOf(State.NOT_EXIST_VIDEO) === -1 && <VStack alignItems='flex-start'>
        <Flex width='100%' gap='1rem' alignItems='stretch'
          flexDirection={{
            'base': 'column',
            'lg': 'row',
          }}
        >
          <VideoPlayer video={video} ref={videoRef}/>
          {playList && <Box>
            <PlayListVideoListView
              width={{
                'base': '100%',
                'lg': '20rem',
              }}
              height={{
                'base': 'none',
                'lg': videoPlayerHeight,
              }}
              maxHeight={{
                'base': '18rem',
                'lg': 'none',
              }}
              playList={playList}
              video={video}
            />
          </Box>}
        </Flex>
        <VStack width='100%' alignItems='flex-start'>
          <Heading size='md' marginTop='0.75rem' marginBottom='0'>{video.title}</Heading>
          <Text fontSize='sm' fontWeight={700}>{video.account.nickname}</Text>
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
    {stateList.indexOf(State.NOT_EXIST_VIDEO) === -1 && <PlayListVideoAddAlert
      open={openAddPlayListAlert}
      video={video}
      onClose={onClosePlayListVideoAddAlert}
      onConfirm={onConfirmPlayListVideoAddAlert}
    />}
  </MainLayout>;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const tokenInfo: TokenInfo | null = await getTokenInfoByCookies(context);
  const videoKey: string | null = context.query.vk ? context.query.vk as string : null;
  const playListKey: string | null = context.query.pk ? context.query.pk as string : null;

  const stateList: State[] = [];
  let video: Video | null = null;
  let playList: PlayList | null = null;

  if (videoKey === null && playListKey === null) {
    return {
      props: {
        video: null,
        playList: null,
        states: [State.NOT_EXIST_VIDEO, State.NOT_EXIST_PLAY_LIST,],
      },
    };
  }

  if (playListKey !== null) {
    try {
      playList = await iritubeAPI.getPlayList(tokenInfo, playListKey);
    } catch (error) { // 재생 목록이 올바르지 않은 경우
      stateList.push(State.NOT_EXIST_PLAY_LIST);
    }
  }

  if (videoKey === null && playList && playList.videos && playList.videos.length > 0) {
    return {
      redirect: {
        permanent: false,
        destination: '/videos?vk=' + playList.videos[0].videoKey + '&pk=' + playList.playListKey,
      },
    };
  }

  try {
    video = await iritubeAPI.getVideo(tokenInfo, videoKey);
  } catch (error) {
    stateList.push(State.NOT_EXIST_VIDEO);
  }

  return {
    props: {
      video: JSON.parse(JSON.stringify(video)),
      playList,
      states: stateList,
    },
  };
};

export default VideosPage;
