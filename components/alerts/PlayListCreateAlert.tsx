import { useRef, useState, ChangeEvent, useEffect, } from 'react';
import {
  AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Button,
  ButtonGroup, FormControl, FormLabel, Input,
} from '@chakra-ui/react';

import { useSetRecoilState, } from 'recoil';
import { playListListAtom, } from '@root/recoil';
import { PlayList, PlayListList, TokenInfo, } from '@root/interfaces';
import iritubeAPI from '@root/utils/iritubeAPI';
import { getTokenInfo, } from '@root/utils';

type Props = {
  open?: boolean;
  onClose?: () => void;
  onConfirm?: (playList: PlayList) => void;
}

enum Status {
  IDLE,
  REQUEST,
}

const PlayListCreateAlert = ({
  open = false,
  onClose = () => {},
  onConfirm = () => {},
}: Props) => {
  const closeRef = useRef();

  const setPlayListList = useSetRecoilState(playListListAtom);

  const [state, setState,] = useState<Status>(Status.IDLE);
  const [title, setTitle,] = useState<string>('');

  useEffect(() => {
    setTitle('');
  }, []);

  useEffect(() => {
    if (open) {
      setState(Status.IDLE);
      setTitle('');
    }
  }, [open,]);

  const onChangeTitle = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const onClickCreate = async () => {
    setState(Status.REQUEST);

    try {
      const tokenInfo: TokenInfo = await getTokenInfo();
      const playList: PlayList = await iritubeAPI.createPlayList(tokenInfo, title.trim());
      const playListList: PlayListList = await iritubeAPI.getMyPlayListList(tokenInfo, 0, 10);
      setPlayListList(playListList);
      onConfirm(playList);
    } catch {
      setState(Status.IDLE);
    }
  };

  return <AlertDialog
    isOpen={open}
    leastDestructiveRef={closeRef}
    onClose={onClose}
  >
    <AlertDialogOverlay/>
    <AlertDialogContent>
      <AlertDialogHeader>재생 목록 생성</AlertDialogHeader>
      <AlertDialogBody>
        <FormControl>
          <FormLabel>제목</FormLabel>
          <Input type='text' value={title} isDisabled={state === Status.REQUEST} onChange={onChangeTitle}/>
        </FormControl>
      </AlertDialogBody>
      <AlertDialogFooter>
        <ButtonGroup>
          <Button variant='outline' isDisabled={state === Status.REQUEST} onClick={onClose}>취소</Button>
          <Button isDisabled={title.length === 0 || state === Status.REQUEST} onClick={onClickCreate}>생성</Button>
        </ButtonGroup>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>;
};

export default PlayListCreateAlert;
