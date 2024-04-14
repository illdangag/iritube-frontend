import { useRef, } from 'react';
import {
  AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Button,
  ButtonGroup, Text,
} from '@chakra-ui/react';

import {} from 'recoil';
import {} from '@root/recoil';
import { PlayList, } from '@root/interfaces';
import {} from '@root/utils';

type Props = {
  isOpen?: boolean;
  isLoading?: boolean;
  playList: PlayList;
  onClose?: () => void;
  onConfirm?: (playList: PlayList) => void;
}

const PlayListDeleteAlert = ({
  isOpen = false,
  isLoading = false,
  playList,
  onClose = () => {},
  onConfirm = () => {},
}: Props) => {
  const closeRef = useRef();

  return <AlertDialog leastDestructiveRef={closeRef} isOpen={isOpen} onClose={() => {
    if (!isLoading) {
      onClose();
    }
  }}>
    <AlertDialogOverlay/>
    <AlertDialogContent>
      <AlertDialogHeader>재생 목록 삭제</AlertDialogHeader>
      <AlertDialogBody>
        <Text>"{playList.title}"을 삭제 하시겠습니까?</Text>
      </AlertDialogBody>
      <AlertDialogFooter>
        <ButtonGroup>
          <Button variant='outline' onClick={onClose} isDisabled={isLoading}>취소</Button>
          <Button onClick={() => onConfirm(playList)} isLoading={isLoading}>삭제</Button>
        </ButtonGroup>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>;
};

export default PlayListDeleteAlert;
