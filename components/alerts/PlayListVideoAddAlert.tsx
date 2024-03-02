import { useRef, useState, useEffect, } from 'react';
import {
  AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Box,
  Button, ButtonGroup, Radio, RadioGroup, VStack, Text, Spacer,
} from '@chakra-ui/react';
import { PlayListCreateAlert, } from '@root/components/alerts';

import { useRecoilValue, } from 'recoil';
import { playListListAtom, } from '@root/recoil';
import { PlayList, PlayListList, TokenInfo, Video, } from '@root/interfaces';
import { BrowserStorage, } from '@root/utils';
import iritubeAPI from '@root/utils/iritubeAPI';

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

  const playListList = useRecoilValue<PlayListList | null>(playListListAtom);

  const [state, setState,] = useState<State>(State.IDLE);
  const [selectedPlayListKey, setSelectedPlayListKey,] = useState<string>('');
  const [openPlayListCreateAlert, setOpenPlayListCreateAlert,] = useState<boolean>(false);

  useEffect(() => {
    setState(State.IDLE);
    setSelectedPlayListKey('');
    setOpenPlayListCreateAlert(false);
  }, [open,]);

  const onChangePlayListRadio = (newValue: string) => {
    setSelectedPlayListKey(newValue);
  };

  const onClickPPlayListAddButton = async () => {
    setState(State.REQUEST);
    const tokenInfo: TokenInfo = BrowserStorage.getTokenInfo();
    await addVideoAtPlayList(tokenInfo);
    onConfirm();
  };

  const onClickPlayListCreateButton = () => {
    setOpenPlayListCreateAlert(true);
  };

  const onClosePlayListCreateAlert = () => {
    setOpenPlayListCreateAlert(false);
  };

  const onConfirmPlayListCreateAlert = () => {
    setOpenPlayListCreateAlert(false);
  };

  const addVideoAtPlayList = async (tokenInfo: TokenInfo): Promise<PlayList> => {
    const playList: PlayList = await iritubeAPI.getPlayList(tokenInfo, selectedPlayListKey);
    const videoKeyList: string[] = playList.videos.map(video => video.videoKey);
    videoKeyList.push(video.videoKey);
    return await iritubeAPI.updatePlayList(tokenInfo, selectedPlayListKey, playList.title, videoKeyList);
  };

  return <>
    <AlertDialog leastDestructiveRef={closeRef} isOpen={open} onClose={onClose}>
      <AlertDialogOverlay/>
      <AlertDialogContent>
        <AlertDialogHeader>재생 목록</AlertDialogHeader>
        <AlertDialogBody>
          {playListList && playListList.playLists.length === 0 && <Box>
            <Text>재생 목록이 존재 하지 않습니다.</Text>
          </Box>}
          {playListList && playListList.playLists.length > 0 && <RadioGroup onChange={onChangePlayListRadio} value={selectedPlayListKey}>
            <VStack alignItems='flex-start'>
              {playListList.playLists.map((playList, index) => <Radio key={index} value={playList.playListKey}>{playList.title}</Radio>)}
            </VStack>
          </RadioGroup>}
        </AlertDialogBody>
        <AlertDialogFooter>
          <Button variant='outline' onClick={onClickPlayListCreateButton} isDisabled={state === State.REQUEST}>재생 목록 생성</Button>
          <Spacer/>
          <ButtonGroup>
            <Button variant='outline' onClick={onClose} isDisabled={state === State.REQUEST}>취소</Button>
            <Button
              isDisabled={selectedPlayListKey === ''}
              onClick={onClickPPlayListAddButton}
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
