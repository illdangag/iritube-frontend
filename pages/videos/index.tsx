import { useEffect, useRef, useState, } from 'react';
import { GetServerSideProps, } from 'next/types';
import { useRouter, } from 'next/router';
import { Box, Card, CardBody, Flex, Text, VStack, } from '@chakra-ui/react';
import { MainLayout, } from '@root/layouts';
import { PlayListVideoListView, VideoPlayer, } from '@root/components';
import { VideoCommentArea, VideoDescriptionArea, } from '@root/components/pages/videos';

import { PlayList, TokenInfo, Video, VideoShare, } from '@root/interfaces';
import { getTokenInfoByCookies, iritubeAPI, } from '@root/utils';
import { throttle, } from 'lodash';

type Props = {
  video: Video | null,
  playList: PlayList | null,
  videoCommentPage: number,
};

const VideosPage = (props: Props) => {
  const video: Video | null = props.video ? Video.getInstance(props.video) : null;
  const playList: PlayList | null = props.playList ? PlayList.getInstance(props.playList) : null;
  const videoCommentPage: number = props.videoCommentPage;

  const router = useRouter();
  const videoKey: string = router.query.vk as string;

  const videoRef = useRef<HTMLDivElement>(null);
  const invalidVideoRef = useRef<HTMLDivElement>(null);

  const [videoPlayerHeight, setVideoPlayerHeight,] = useState<number>(-1);
  const [wide, setWide,] = useState<boolean>(false);

  useEffect(() => {
    const windowResizeCallback = throttle(() => {
      setVideoPlayerHeight(getPlayListHeight());
    }, 100);

    setVideoPlayerHeight(getPlayListHeight());
    window.addEventListener('resize', windowResizeCallback);

    return () => {
      window.removeEventListener('resize', windowResizeCallback);
    };
  }, []);

  useEffect(() => {
    setVideoPlayerHeight(getPlayListHeight());
  }, [wide, playList,]);

  const getPlayListHeight = () => {
    return videoRef.current ? videoRef.current.offsetHeight : invalidVideoRef.current.offsetHeight;
  };

  const onEndedVideoPlayer = () => {
    pushNextVideo();
  };

  const onPreviousVideo = () => {
    pushPreviousVideo();
  };

  const onNextVideo = () => {
    pushNextVideo();
  };

  const onWideVideo = () => {
    setWide(true);
  };

  const onNarrowVideo = () => {
    setWide(false);
  };

  /**
   * 재생 목록에서 다음 동영상 페이지로 이동
   */
  const pushNextVideo = () => {
    if (!playList) {
      return;
    }

    const videoLength: number = playList.videos.length;
    const currentVideoIndex: number = playList.videos
      .findIndex((item) => item.videoKey === video.videoKey);

    if (videoLength - 1 === currentVideoIndex) { // 재생 목록의 마지막 동영상인 경우
      return;
    }

    let nextVideo: Video | null = null;
    for (let index = currentVideoIndex + 1; index < videoLength; index++) {
      if (playList.videos[index].id) {
        nextVideo = playList.videos[index];
        break;
      }
    }

    if (nextVideo) {
      void router.push('/videos?vk=' + nextVideo.videoKey + '&pk=' + playList.playListKey);
    }
  };

  /**
   * 재생 목록에서 이전 동영상 페이지로 이동
   */
  const pushPreviousVideo = () => {
    if (!playList) { // 재생 목록이 존재하지 않는 경우
      return;
    }

    const currentVideoIndex: number = playList.videos
      .findIndex((item) => item.videoKey === video.videoKey);

    if (currentVideoIndex === 0) { // 재생 목록의 첫번째 동영상인 경우
      return;
    }

    // 재생 목록의 이전 동영상
    let previousVideo: Video | null = null;
    for (let index = currentVideoIndex - 1; index >= 0; index--) {
      if (playList.videos[index].id) {
        previousVideo = playList.videos[index];
        break;
      }
    }

    if (previousVideo) {
      void router.push('/videos?vk=' + previousVideo.videoKey + '&pk=' + playList.playListKey);
    }
  };

  return <MainLayout title={(video && video.id ? (video.getTitle() + ' | ') : '') + 'Iritube'}>
    <Box>
      <VStack alignItems='stretch'>
        <Flex width='100%' gap='1rem' alignItems='stretch'
          flexDirection={{
            'base': 'column',
            'lg': wide ? 'column' : 'row',
          }}
        >
          {(!video || !video?.id) && <Box width='100%' height='100%'>
            <Card aspectRatio='16/9' ref={invalidVideoRef}>
              <CardBody>
                {!video && <Text>동영상이 존재하지 않습니다.</Text>}
                {video && video.deleted && <Text>삭제된 동영상입니다.</Text>}
                {video && !video.deleted && video.share === VideoShare.PRIVATE && <Text>비공개 동영상입니다.</Text>}
              </CardBody>
            </Card>
          </Box>}
          {video && video.id && !playList && <VideoPlayer
            video={video}
            ref={videoRef}
            autoPlay={true}
            onEnded={onEndedVideoPlayer}
          />}
          {video && video.id && playList && <VideoPlayer
            video={video}
            ref={videoRef}
            autoPlay={true}
            onEnded={onEndedVideoPlayer}
            onPrevious={onPreviousVideo}
            onNext={onNextVideo}
            onWide={onWideVideo}
            onNarrow={onNarrowVideo}
          />}
          {playList && <Box>
            <PlayListVideoListView
              width={{ 'base': '100%', 'lg': wide ? '100%' : '20rem', }}
              height={{ 'base': 'none', 'lg': wide ? 'none' : videoPlayerHeight, }}
              maxHeight={{ 'base': '18rem', 'lg': wide ? '18rem' : 'none', }}
              playList={playList}
              videoKey={videoKey}
            />
          </Box>}
        </Flex>
        {video && video.id && <VideoDescriptionArea video={video}/>}
        {video && video.id && <VideoCommentArea video={video} videoCommentPage={videoCommentPage}/>}
      </VStack>
    </Box>
  </MainLayout>;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const tokenInfo: TokenInfo | null = await getTokenInfoByCookies(context);
  const videoKey: string | null = context.query.vk ? context.query.vk as string : null;
  const playListKey: string | null = context.query.pk ? context.query.pk as string : null;
  const commentPageValue: string | null = context.query.cp ? context.query.cp as string : null;

  let video: Video | null = null;
  let playList: PlayList | null = null;
  let videoCommentPage: number = 1;

  if (videoKey === null && playListKey === null) { // 동영상 키, 재생 목록 키가 모두 존재하지 않는다면
    return {
      props: {
        video: null,
        playList: null,
      },
    };
  }

  if (playListKey) {
    try {
      playList = await iritubeAPI.getPlayList(tokenInfo, playListKey);
    } catch (error) {}
  }

  if (commentPageValue) {
    videoCommentPage = parseInt(commentPageValue, 10);
    if (videoCommentPage < 1) {
      videoCommentPage = 1;
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

  if (videoKey) {
    try {
      video = await iritubeAPI.getVideo(tokenInfo, videoKey);
    } catch (error) {
      console.error(error);
    }
  }

  return {
    props: {
      video: JSON.parse(JSON.stringify(video)),
      playList: JSON.parse(JSON.stringify(playList)),
      videoCommentPage: videoCommentPage,
    },
  };
};

export default VideosPage;
