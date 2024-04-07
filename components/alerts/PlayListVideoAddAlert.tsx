import { useEffect, useRef, useState, } from 'react';
import {
  AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Box,
  Button, ButtonGroup, FormControl, FormErrorMessage, Radio, RadioGroup, Spacer, Text, VStack,
} from '@chakra-ui/react';
import { PlayListCreateAlert, } from '@root/components/alerts';

import { PlayList, PlayListList, TokenInfo, Video, } from '@root/interfaces';
import { getTokenInfo, iritubeAPI, } from '@root/utils';

type Props = {
  video: Video;
  open?: boolean;
  onClose?: () => void;
  onConfirm?: () => void;
}

enum State {
  IDLE,
  REQUEST,
}

const PlayListVideoAddAlert = ({
  video,
  open = false,
  onClose = () => {},
  onConfirm = () => {},
}: Props) => {
  const closeRef = useRef();

  const [playListList, setPlayListList,] = useState<PlayListList | null>(null);

  const [state, setState,] = useState<State>(State.IDLE);
  const [selectedPlayListKey, setSelectedPlayListKey,] = useState<string>('');
  const [openPlayListCreateAlert, setOpenPlayListCreateAlert,] = useState<boolean>(false);
  const [alreadyExistVideo, setAlreadyExistVideo,] = useState<boolean>(false);

  useEffect(() => {
    void init();
    setState(State.IDLE);
    setSelectedPlayListKey('');
    setOpenPlayListCreateAlert(false);
    setAlreadyExistVideo(false);
  }, [open,]);

  const init = async () => {
    const tokenInfo: TokenInfo | null = await getTokenInfo();
    if (tokenInfo) {
      const playListList: PlayListList = await iritubeAPI.getMyPlayListList(tokenInfo, 0, 100);
      setPlayListList(playListList);
    }
  };

  const onChangePlayListRadio = (newValue: string) => {
    setAlreadyExistVideo(false);
    setSelectedPlayListKey(newValue);
  };

  const onClickPlayListAddButton = async () => {
    setState(State.REQUEST);
    const tokenInfo: TokenInfo = await getTokenInfo();
    const playList: PlayList = await iritubeAPI.getPlayList(tokenInfo, selectedPlayListKey);
    const videoKeyList: string[] = playList.videos.map(video => video.videoKey);
    if (videoKeyList.indexOf(video.videoKey) > -1) {
      setAlreadyExistVideo(true);
      setState(State.IDLE);
    } else {
      playList.videos.push(video);
      await iritubeAPI.updatePlayList(tokenInfo, playList);
      onConfirm();
    }
  };

  const onClickPlayListCreateButton = () => {
    setOpenPlayListCreateAlert(true);
  };

  const onClosePlayListCreateAlert = () => {
    setOpenPlayListCreateAlert(false);
  };

  const onConfirmPlayListCreateAlert = () => {
    void init()
      .then(() => {
        setOpenPlayListCreateAlert(false);
      });
  };

  return <>
    <AlertDialog leastDestructiveRef={closeRef} isOpen={open} onClose={onClose}>
      <AlertDialogOverlay/>
      <AlertDialogContent>
        <AlertDialogHeader>재생 목록</AlertDialogHeader>
        <AlertDialogBody>
          {playListList?.playLists.length === 0 && <Box>
            <Text>재생 목록이 존재 하지 않습니다.</Text>
          </Box>}
          {playListList?.playLists.length > 0 && <FormControl isInvalid={alreadyExistVideo}>
            <RadioGroup onChange={onChangePlayListRadio} value={selectedPlayListKey} isDisabled={state === State.REQUEST}>
              <VStack alignItems='flex-start'>
                {playListList.playLists.map((playList, index) => <Radio key={index} value={playList.playListKey}>{playList.title}</Radio>)}
              </VStack>
            </RadioGroup>
            <FormErrorMessage>재생 목록에 해당 동영상이 이미 존재합니다.</FormErrorMessage>
          </FormControl>}
        </AlertDialogBody>
        <AlertDialogFooter>
          <Button variant='outline' onClick={onClickPlayListCreateButton} isDisabled={state === State.REQUEST}>재생 목록 생성</Button>
          <Spacer/>
          <ButtonGroup>
            <Button variant='outline' onClick={onClose} isDisabled={state === State.REQUEST}>취소</Button>
            <Button
              isDisabled={selectedPlayListKey === ''}
              onClick={onClickPlayListAddButton}
              isLoading={state === State.REQUEST}
            >
              추가
            </Button>
          </ButtonGroup>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    <PlayListCreateAlert
      open={openPlayListCreateAlert}
      onClose={onClosePlayListCreateAlert}
      onConfirm={onConfirmPlayListCreateAlert}
    />
  </>;
};

export default PlayListVideoAddAlert;
