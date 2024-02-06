import { useRef, useEffect, MouseEvent, useState, } from 'react';
import { Box, VStack, Heading, HStack, IconButton, Progress, Fade, Flex, } from '@chakra-ui/react';
import { MdPlayArrow, MdPause,  } from 'react-icons/md';

import Hls from 'hls.js';

import { Video, } from '@root/interfaces';

type Props = {
  video: Video,
};

enum VideoState {
  PLAY = 'PLAY',
  PAUSE = 'PAUSE',
}

const VideoPlayer = ({
  video,
}: Props) => {
  const videoRef = useRef();
  const [videoState, setVideoState,] = useState<VideoState>(VideoState.PAUSE);
  const [videoProgress, setVideoProgress,] = useState<number>(0);
  const [showCenterPlay, setShowCenterPlay,] = useState<boolean>(false);
  const [showCenterPause, setShowCenterPause,] = useState<boolean>(false);

  useEffect(() => {
    const hls = new Hls({
      autoStartLoad: true,
    });
    hls.loadSource(video.hlsPath);
    hls.attachMedia(videoRef.current);

    let interval = null;
    hls.on(Hls.Events.MANIFEST_LOADED, () => {
      interval = setInterval(() => {
        const videoElement: HTMLVideoElement = videoRef.current as HTMLVideoElement;
        const progress: number =  Math.round(videoElement.currentTime / video.duration * 100);
        setVideoProgress(progress);

        if (videoElement.paused) {
          setVideoState(VideoState.PAUSE);
        } else {
          setVideoState(VideoState.PLAY);
        }
      }, 50);
    });

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [video,]);

  const play = () => {
    void (videoRef.current as HTMLVideoElement).play()
      .then(() => {
        setVideoState(VideoState.PLAY);
        setShowCenterPlay(true);
        setTimeout(() => {
          setShowCenterPlay(false);
        }, 400);
      });
  };

  const pause = () => {
    (videoRef.current as HTMLVideoElement).pause();
    setVideoState(VideoState.PAUSE);
    setShowCenterPause(true);
    setTimeout(() => {
      setShowCenterPause(false);
    }, 400);
  };

  const onContextMenu = (event: MouseEvent<HTMLVideoElement>) => {
    event.preventDefault(); // disable video element context menu
  };

  const onClickVideo = () => {
    if (videoState === VideoState.PLAY) {
      pause();
    } else {
      play();
    }
  };

  const onClickPlayButton = () => {
    play();
  };

  const onClickPauseButton = () => {
    pause();
  };

  const onClickProgress = (event: MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const selectProgress: number = (event.clientX - rect.left) / rect.width;
    (videoRef.current as HTMLVideoElement).currentTime = selectProgress * video.duration;
  };

  return <Box>
    <VStack alignItems='row'>
      <Box position='relative'>
        <VStack>
          <video ref={videoRef} onContextMenu={onContextMenu}/>
        </VStack>
        <Fade in={showCenterPlay}>
          <Box position='absolute' top='50%' left='50%' transform='translate(-50%, -50%)'>
            <IconButton
              opacity={0.4}
              backgroundColor='#495057'
              aria-label=''
              isRound={true}
              size='xl'
              colorScheme='gray'
              fontSize='3rem'
              padding='0.8rem'
              icon={<MdPlayArrow/>}
            />
          </Box>
        </Fade>
        <Fade in={showCenterPause}>
          <Box position='absolute' top='50%' left='50%' transform='translate(-50%, -50%)'>
            <IconButton
              opacity={0.4}
              backgroundColor='#495057'
              aria-label=''
              isRound={true}
              size='xl'
              colorScheme='gray'
              fontSize='3rem'
              padding='0.8rem'
              icon={<MdPause/>}
            />
          </Box>
        </Fade>
        <Box position='absolute' top='0' left='0' width='100%' height='100%' onClick={onClickVideo}/>
        <VStack position='absolute' bottom='0' padding='0.5rem' width='100%' alignItems='row'>
          <Flex flexDirection='column' justifyContent='center' height='1rem' cursor='pointer' position='relative' onClick={onClickProgress}>
            <Progress height='0.2rem' value={videoProgress}/>
          </Flex>
          <HStack>
            {videoState === VideoState.PAUSE && <IconButton
              aria-label='play'
              size='sm'
              fontSize='1.4rem'
              variant='ghost'
              icon={<MdPlayArrow/>}
              onClick={onClickPlayButton}
            />}
            {videoState === VideoState.PLAY && <IconButton
              aria-label='pause'
              size='sm'
              fontSize='1.4rem'
              variant='ghost'
              icon={<MdPause/>}
              onClick={onClickPauseButton}
            />}
          </HStack>
        </VStack>
      </Box>
      <Heading size='md'>{video.title}</Heading>
    </VStack>
  </Box>;
};

export default VideoPlayer;
