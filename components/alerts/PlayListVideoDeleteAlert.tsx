import { useRef, } from 'react';
import {
  AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Button,
  ButtonGroup, Text,
} from '@chakra-ui/react';

import { Video, } from '@root/interfaces';
import {} from '@root/utils';

type Props = {
  video: Video;
  isOpen?: boolean;
  onClose?: () => void;
  onConfirm?: () => void;
}

const PlayListVideoDeleteAlert = ({
  video,
  isOpen = false,
  onClose = () => {},
  onConfirm = () => {},
}: Props) => {
  const closeRef = useRef();

  return <AlertDialog leastDestructiveRef={closeRef} isOpen={isOpen} onClose={onClose}>
    <AlertDialogOverlay/>
    <AlertDialogContent>
      <AlertDialogHeader>삭제</AlertDialogHeader>
      <AlertDialogBody>
        <Text>"{video.title}"을 재생 목록에서 삭제 하시겠습니까?</Text>
      </AlertDialogBody>
      <AlertDialogFooter>
        <ButtonGroup>
          <Button variant='outline' onClick={onClose}>취소</Button>
          <Button onClick={onConfirm}>삭제</Button>
        </ButtonGroup>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>;
};

export default PlayListVideoDeleteAlert;
