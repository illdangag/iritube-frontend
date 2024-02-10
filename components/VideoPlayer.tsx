import React, { MouseEvent, useEffect, useRef, useState, } from 'react';
import {
  Box, Fade, Flex, Heading, HStack, IconButton, Menu, MenuButton, MenuItem, MenuList, Progress, Slider,
  SliderFilledTrack, SliderThumb, SliderTrack, Text, VStack,
} from '@chakra-ui/react';
import { MdOutlineSettings, MdPause, MdPlayArrow, MdVolumeOff, MdVolumeUp, } from 'react-icons/md';

import Hls, { Level, } from 'hls.js';
import { Video, } from '@root/interfaces';

type Props = {
  video: Video,
}

enum State {
  PLAY = 'PLAY',
  PAUSE = 'PAUSE',
}

const hls = new Hls({
  autoStartLoad: true,
  debug: false,
  enableWorker: true,
  lowLatencyMode: true,
  backBufferLength: 90,
});

const VideoPlayer = (props: Props) => {
  const video: Video = props.video;

  const videoRef = useRef();
  const [videoState, setVideoState,] = useState<State>(State.PAUSE);
  const [videoProgress, setVideoProgress,] = useState<number>(0);
  const [showCenterPlay, setShowCenterPlay,] = useState<boolean>(false);
  const [showCenterPause, setShowCenterPause,] = useState<boolean>(false);
  const [totalTime, setTotalTime,] = useState<string>('');
  const [currentTime, setCurrentTime,] = useState<string>('');

  const [levelList, setLevelList,] = useState<Level[]>([]);
  const [currentLevel, setCurrentLevel,] = useState<number>(-1);
  const [existAudio, setExistAudio,] = useState<boolean>(false);
  const [volume, setVolume,] = useState<number>(0.5);
  const [mute, setMute,] = useState<boolean>(false);

  hls.on(Hls.Events.MANIFEST_LOADED, (_event, data) => {
    setLevelList(hls.levels);
    setTotalTime(convertTime(video.duration));
  });

  hls.on(Hls.Events.LEVEL_SWITCHED, () => {
    const videoElement: HTMLVideoElement = videoRef.current as HTMLVideoElement;
    setExistAudio(hasAudio(videoElement));
  });

  useEffect(() => {
    const videoElement: HTMLVideoElement = videoRef.current as HTMLVideoElement;
    videoElement.volume = volume;

    hls.loadSource(video.hlsPath);
    hls.attachMedia(videoRef.current);

    const interval = setInterval(() => {
      const videoElement: HTMLVideoElement = videoRef.current as HTMLVideoElement;
      setCurrentTime(convertTime(videoElement.currentTime));
      const progress: number =  Math.round(videoElement.currentTime / video.duration * 100);
      setVideoProgress(progress);

      if (videoElement.paused) {
        setVideoState(State.PAUSE);
      } else {
        setVideoState(State.PLAY);
      }
      setCurrentLevel(hls.currentLevel);
    }, 50);

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

  const hasAudio = (video: any): boolean => {
    return video.mozHasAudio ||
      Boolean(video.webkitAudioDecodedByteCount) ||
      Boolean(video.audioTracks && video.audioTracks.length);
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

  const setQuality = (level: Level) => {
    hls.currentLevel = levelList.indexOf(level);
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

  const onChangeVolume = (value: number) => {
    const videoElement: HTMLVideoElement = videoRef.current as HTMLVideoElement;

    if (mute) {
      setMute(false);
    }

    videoElement.volume = value / 100;
    setVolume(value / 100);
  };

  const onClickVolume = () => {
    const videoElement: HTMLVideoElement = videoRef.current as HTMLVideoElement;

    if (mute) {
      videoElement.volume = volume;
      setMute(false);
    } else {
      videoElement.volume = 0;
      setMute(true);
    }
  };

  const onClickProgress = (event: MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const selectProgress: number = (event.clientX - rect.left) / rect.width;
    (videoRef.current as HTMLVideoElement).currentTime = selectProgress * video.duration;
  };

  return <Box>
    <VStack alignItems='row'>
      <Box position='relative' backgroundColor='black'>
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
          backgroundImage: 'linear-gradient(to top, #00000040, #ffffff00)',
        }} position='absolute' bottom='0' padding='0.5rem' width='100%' alignItems='row' borderBottomRadius='1rem'>
          <Flex flexDirection='column' justifyContent='center' height='1rem' cursor='pointer' position='relative' onClick={onClickProgress}>
            <Progress height='0.2rem' value={videoProgress}/>
          </Flex>
          <HStack justifyContent='space-between'>
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
              {!existAudio && <IconButton
                aria-label='notExistAudio'
                size='sm'
                fontSize='1.4rem'
                variant='ghost'
                _hover={{
                  backgroundColor: '#00000033',
                }}
                isDisabled
                icon={<MdVolumeOff color='#ffffff'/>}
              />}
              {existAudio && <IconButton
                aria-label='audioCountols'
                size='sm'
                fontSize='1.4rem'
                variant='ghost'
                _hover={{
                  backgroundColor: '#00000033',
                }}
                icon={mute || volume === 0 ? <MdVolumeOff color='#ffffff'/> : <MdVolumeUp color='#ffffff'/>}
                onClick={onClickVolume}
              />}
              {existAudio && <Box width='4rem'>
                <Slider
                  aria-label='volumnSlider'
                  defaultValue={(videoRef.current as HTMLVideoElement).volume * 100}
                  value={mute ? 0 : volume * 100}
                  onChange={onChangeVolume}
                >
                  <SliderTrack>
                    <SliderFilledTrack/>
                  </SliderTrack>
                  <SliderThumb/>
                </Slider>
              </Box>}
            </HStack>
            <HStack>
              {currentLevel > -1 && <Text fontSize='0.8rem'>{levelList[currentLevel].height}</Text>}
              <Menu>
                <MenuButton
                  as={IconButton}
                  icon={<MdOutlineSettings color='#ffffff'/>}
                  aria-label='quality'
                  size='sm'
                  fontSize='1.4rem'
                  variant='ghost'
                  _hover={{
                    backgroundColor: '#00000033',
                  }}
                >
                </MenuButton>
                <MenuList>
                  {levelList.map((level, index) => <MenuItem
                    key={'' + level.height + index}
                    onClick={() => setQuality(level)}
                  >
                    {level.height}
                  </MenuItem>)}
                </MenuList>
              </Menu>
            </HStack>
          </HStack>
        </VStack>
      </Box>
      <Heading size='md'>{video.title}</Heading>
    </VStack>
  </Box>;
};

export default VideoPlayer;
