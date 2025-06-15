import { MouseEvent, useEffect, useRef, useState, memo, forwardRef, ReactEventHandler, } from 'react';
import { Box, Fade, Flex, HStack, IconButton, Menu, MenuButton, MenuItem, MenuList, Progress, Slider, SliderFilledTrack, SliderThumb, SliderTrack, Text, VStack, } from '@chakra-ui/react';
import { MdOutlineSettings, MdPause, MdPlayArrow, MdVolumeOff, MdVolumeUp, MdSkipNext, MdSkipPrevious, MdOutlineCrop32, } from 'react-icons/md';

import Hls, { Level, } from 'hls.js';
import { TokenInfo, Video, } from '@root/interfaces';
import { getTokenInfo, } from '@root/utils';

type Props = {
  video: Video;
  autoPlay?: boolean;
  onEnded?: ReactEventHandler<HTMLVideoElement>;
  onPrevious?: () => void;
  onNext?: () => void;
  onWide?: () => void;
  onNarrow?: () => void;
};

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
  xhrSetup: async (xhr, _url) => {
    const tokenInfo: TokenInfo | null = await getTokenInfo();
    if (tokenInfo) {
      xhr.setRequestHeader('Authorization', 'Bearer ' + tokenInfo.token);
    }
  },
});

const VideoPlayer = ({
  video,
  autoPlay = false,
  onEnded = () => {},
  onPrevious,
  onNext,
  onWide,
  onNarrow,
}: Props, ref) => {
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
  const [isMute, setIsMute,] = useState<boolean>(false);
  const [wide, setWide,] = useState<boolean>(false);
  const [showVideoController, setShowVideoController,] = useState<boolean>(true);
  const [showVideoControllerTimout, setShowVideoControllerTimout,] = useState<NodeJS.Timeout | null>(null);

  hls.on(Hls.Events.MANIFEST_LOADED, () => {
    setLevelList(hls.levels);
    setTotalTime(convertTime(video.duration));
  });

  useEffect(() => {
    const videoElement: HTMLVideoElement = videoRef.current as HTMLVideoElement;
    videoElement.volume = volume;

    hls.loadSource(video.hlsPath);
    hls.attachMedia(videoRef.current);

    const interval = setInterval(() => {
      const videoElement: HTMLVideoElement = videoRef.current as HTMLVideoElement;
      if (!videoElement) {
        return;
      }

      setExistAudio(hasAudio(videoElement));

      setCurrentTime(convertTime(videoElement.currentTime));
      const progress: number =  Math.ceil(videoElement.currentTime / video.duration * 100);
      setVideoProgress(progress);

      if (videoElement.paused) {
        setVideoState(State.PAUSE);
      } else {
        setVideoState(State.PLAY);
      }
      setCurrentLevel(hls.currentLevel);
    }, 100);

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
    const time: number = Math.floor(duration);
    const hour: number = Math.floor(time / 3600);
    const minute: number = Math.floor((time - hour * 3600) / 60);
    const second: number = Math.floor(time - hour * 3600 - minute * 60);

    return (hour > 0 ? hour + ':' : '') + String(minute).padStart(2, '0') + ':' + String(second).padStart(2, '0');
  };

  const hasAudio = (video: any): boolean => {
    return video && (video.mozHasAudio ||
      Boolean(video.webkitAudioDecodedByteCount) ||
      Boolean(video.audioTracks && video.audioTracks.length));
  };

  const playVideo = () => {
    void (videoRef.current as HTMLVideoElement).play()
      .then(() => {
        setVideoState(State.PLAY);
        setShowCenterPlay(true);
        setTimeout(() => {
          setShowCenterPlay(false);
        }, 400);
      });
  };

  const pauseVideo = () => {
    (videoRef.current as HTMLVideoElement).pause();
    setVideoState(State.PAUSE);
    setShowCenterPause(true);
    setTimeout(() => {
      setShowCenterPause(false);
    }, 400);
  };

  const muteVideo = () => {
    const videoElement: HTMLVideoElement = videoRef.current as HTMLVideoElement;

    if (isMute) {
      videoElement.volume = volume;
      setIsMute(false);
    } else {
      videoElement.volume = 0;
      setIsMute(true);
    }
  };

  const setQuality = (level: Level) => {
    const selectedLevel: number = levelList.indexOf(level);

    if (hls.currentLevel !== selectedLevel) { // 현재 재생중인 품질과 선택한 품질이 서로 다른 경우
      hls.currentLevel = selectedLevel;
    }
  };

  const onContextMenu = (event: MouseEvent<HTMLVideoElement>) => {
    event.preventDefault(); // disable video element context menu
  };

  const onClickVideo = () => {
    if (videoState === State.PLAY) {
      pauseVideo();
    } else {
      playVideo();
    }
  };

  const onClickPlayButton = () => {
    playVideo();
  };

  const onClickPauseButton = () => {
    pauseVideo();
  };

  const onChangeVolume = (value: number) => {
    const videoElement: HTMLVideoElement = videoRef.current as HTMLVideoElement;
    if (isMute) {
      muteVideo();
    }

    videoElement.volume = value / 100;
    setVolume(value / 100);
  };

  const onClickVolume = () => {
    muteVideo();
  };

  const onClickProgress = (event: MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const selectProgress: number = (event.clientX - rect.left) / rect.width;
    (videoRef.current as HTMLVideoElement).currentTime = selectProgress * video.duration;
  };

  const onWideVideo = () => {
    setWide(true);
    onWide();
  };

  const onNarrowVideo = () => {
    setWide(false);
    onNarrow();
  };

  const onMouseMoveVideo = () => {
    if (!showVideoController) {
      setShowVideoController(true);
    }

    if (showVideoControllerTimout) {
      clearInterval(showVideoControllerTimout);
      setShowVideoControllerTimout(null);
    }

    setShowVideoControllerTimout(setTimeout(() => {
      setShowVideoController(false);
    }, 5000));
  };

  const onMouseLeaveVideo = () => {
    if (showVideoControllerTimout) {
      clearInterval(showVideoControllerTimout);
      setShowVideoControllerTimout(null);
    }

    setShowVideoControllerTimout(setTimeout(() => {
      setShowVideoController(false);
    }, 200));
  };

  return <Box height='100%' ref={ref} onMouseMove={onMouseMoveVideo} onMouseLeave={onMouseLeaveVideo}>
    <Box position='relative' height='100%' backgroundColor='black' borderRadius='lg' overflow='hidden'>
      <VStack width='100%' height='100%' justifyItems='center' alignItems='center' aspectRatio='16/9'>
        <video style={{
          width: '100%',
          height: '100%',
        }} ref={videoRef} playsInline={true} autoPlay={autoPlay} onContextMenu={onContextMenu} onEnded={onEnded}/>
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
      <Fade in={videoState === State.PAUSE || showVideoController}>
        <VStack css={{
          backgroundImage: 'linear-gradient(to top, #00000040, #ffffff00)',
        }} position='absolute' bottom='0' padding='0.5rem' width='100%' alignItems='row'>
          <Flex flexDirection='column' justifyContent='center' height='1rem' cursor='pointer' position='relative' onClick={onClickProgress}>
            <Progress height='0.2rem' value={videoProgress} backgroundColor='#868e9690'/>
          </Flex>
          <HStack justifyContent='space-between'>
            <HStack>
              {onPrevious && <IconButton
                aria-label='previuse'
                size='sm'
                fontSize='1.4rem'
                variant='ghost'
                _hover={{
                  backgroundColor: '#00000033',
                }}
                icon={<MdSkipPrevious color='#ffffff'/>}
                onClick={onPrevious}
              />}
              {videoState === State.PAUSE && <IconButton
                aria-label='pause'
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
              {onNext && <IconButton
                aria-label='next'
                size='sm'
                fontSize='1.4rem'
                variant='ghost'
                _hover={{
                  backgroundColor: '#00000033',
                }}
                icon={<MdSkipNext color='#ffffff'/>}
                onClick={onNext}
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
                icon={isMute || volume === 0 ? <MdVolumeOff color='#ffffff'/> : <MdVolumeUp color='#ffffff'/>}
                onClick={onClickVolume}
              />}
              {existAudio && <Box width='4rem'>
                <Slider
                  aria-label='volumnSlider'
                  defaultValue={(videoRef.current as HTMLVideoElement).volume * 100}
                  value={isMute ? 0 : volume * 100}
                  onChange={onChangeVolume}
                >
                  <SliderTrack backgroundColor='#868e9690'>
                    <SliderFilledTrack/>
                  </SliderTrack>
                  <SliderThumb/>
                </Slider>
              </Box>}
            </HStack>
            <HStack>
              {!wide && onWide && <IconButton
                aria-label='wide'
                size='sm'
                fontSize='1.4rem'
                variant='ghost'
                _hover={{
                  backgroundColor: '#00000033',
                }}
                icon={<MdOutlineCrop32 color='#ffffff'/>}
                onClick={onWideVideo}
              />}
              {wide && onNarrow && <IconButton
                aria-label='wide'
                size='sm'
                fontSize='1.4rem'
                variant='ghost'
                _hover={{
                  backgroundColor: '#00000033',
                }}
                icon={<MdOutlineCrop32 color='#ffffff'/>}
                onClick={onNarrowVideo}
              />}
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
      </Fade>
    </Box>
  </Box>;
};

const equalComparison = (prevProps: Props, nextProps: Props): boolean => {
  return prevProps.video.videoKey === nextProps.video.videoKey;
};

export default memo(forwardRef(VideoPlayer), equalComparison);
