import { useRef, useEffect, MouseEvent, useState, } from 'react';
import { Box, VStack, Heading, HStack, IconButton, Progress, Fade, Flex, Text, BoxProps, } from '@chakra-ui/react';
import { MdPlayArrow, MdPause,  } from 'react-icons/md';

import Hls from 'hls.js';
import { Video, } from '@root/interfaces';

interface Props extends BoxProps {
  video: Video,
}

enum State {
  PLAY = 'PLAY',
  PAUSE = 'PAUSE',
}

const VideoPlayer = (props: Props) => {
  const video: Video = props.video;
  const boxProps: BoxProps = props as BoxProps;

  const videoRef = useRef();
  const [videoState, setVideoState,] = useState<State>(State.PAUSE);
  const [videoProgress, setVideoProgress,] = useState<number>(0);
  const [showCenterPlay, setShowCenterPlay,] = useState<boolean>(false);
  const [showCenterPause, setShowCenterPause,] = useState<boolean>(false);
  const [totalTime, setTotalTime,] = useState<string>('');
  const [currentTime, setCurrentTime,] = useState<string>('');

  useEffect(() => {
    const hls = new Hls({
      autoStartLoad: true,
    });
    hls.loadSource(video.hlsPath);
    hls.attachMedia(videoRef.current);

    let interval = null;
    hls.on(Hls.Events.MANIFEST_LOADED, () => {
      setTotalTime(convertTime(video.duration));
      interval = setInterval(() => {
        const videoElement: HTMLVideoElement = videoRef.current as HTMLVideoElement;
        setCurrentTime(convertTime(videoElement.currentTime));
        const progress: number =  Math.round(videoElement.currentTime / video.duration * 100);
        setVideoProgress(progress);

        if (videoElement.paused) {
          setVideoState(State.PAUSE);
        } else {
          setVideoState(State.PLAY);
        }
      }, 50);
    });

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [video,]);

  /**
   * @param duration 초 단위
   */
  const convertTime = (duration: number): string => {
    const time: number = Math.round(duration);
    const hour: number = Math.floor(time / 3600);
    const minute: number = Math.floor((time - hour * 3600) / 60);
    const second: number = Math.floor(time - hour * 3600 - minute * 60);

    return (hour > 0 ? hour + ':' : '') + String(minute).padStart(2, '0') + ':' + String(second).padStart(2, '0');
  };

  const play = () => {
    void (videoRef.current as HTMLVideoElement).play()
      .then(() => {
        setVideoState(State.PLAY);
        setShowCenterPlay(true);
        setTimeout(() => {
          setShowCenterPlay(false);
        }, 400);
      });
  };

  const pause = () => {
    (videoRef.current as HTMLVideoElement).pause();
    setVideoState(State.PAUSE);
    setShowCenterPause(true);
    setTimeout(() => {
      setShowCenterPause(false);
    }, 400);
  };

  const onContextMenu = (event: MouseEvent<HTMLVideoElement>) => {
    event.preventDefault(); // disable video element context menu
  };

  const onClickVideo = () => {
    if (videoState === State.PLAY) {
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

  return <Box {...boxProps}>
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
        <VStack css={{
          'background-image': 'linear-gradient(to top, #00000040, #ffffff00)',
        }} position='absolute' bottom='0' padding='0.5rem' width='100%' alignItems='row'>
          <Flex flexDirection='column' justifyContent='center' height='1rem' cursor='pointer' position='relative' onClick={onClickProgress}>
            <Progress height='0.2rem' value={videoProgress}/>
          </Flex>
          <HStack>
            {videoState === State.PAUSE && <IconButton
              aria-label='play'
              size='sm'
              fontSize='1.4rem'
              variant='ghost'
              _hover={{
                backgroundColor: '#00000033',
              }}
              icon={<MdPlayArrow color='#ffffff'/>}
              onClick={onClickPlayButton}
            />}
            {videoState === State.PLAY && <IconButton
              aria-label='pause'
              size='sm'
              fontSize='1.4rem'
              variant='ghost'
              _hover={{
                backgroundColor: '#00000033',
              }}
              icon={<MdPause color='#ffffff'/>}
              onClick={onClickPauseButton}
            />}
            <Text color='#ffffff' fontSize='0.8rem'>{`${currentTime} / ${totalTime}`}</Text>
          </HStack>
        </VStack>
      </Box>
      <Heading size='md'>{video.title}</Heading>
    </VStack>
  </Box>;
};

export default VideoPlayer;
