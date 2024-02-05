import { useRef, useEffect, MouseEvent, useState, } from 'react';
import { Box, VStack, CardBody, Text, Heading, Button, HStack, IconButton, Progress, } from '@chakra-ui/react';
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
      });
  };

  const pause = () => {
    (videoRef.current as HTMLVideoElement).pause();
    setVideoState(VideoState.PAUSE);
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

  return <div>
    <Box>
      <VStack alignItems='row'>
        <Box position='relative'>
          <VStack onClick={onClickVideo}>
            <video ref={videoRef} onContextMenu={onContextMenu}/>
          </VStack>
          <VStack position='absolute' bottom='0' padding='0.5rem' width='100%' alignItems='row'>
            <Box><Progress height='0.2rem' value={videoProgress}/></Box>
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
    </Box>

  </div>;
};

export default VideoPlayer;
