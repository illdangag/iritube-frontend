import { useRef, } from 'react';
import {
  AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Button,
  ButtonGroup, Text,
} from '@chakra-ui/react';

import { Video, } from '@root/interfaces';

type Props = {
  video?: Video;
  open?: boolean;
  loading?: boolean;
  onClose?: () => void;
  onConfirm?: (video: Video) => void;
}

const VideoDeleteAlert = ({
  video,
  open = false,
  loading = false,
  onClose = () => {},
  onConfirm = () => {},
}: Props) => {
  const closeRef = useRef();

  return <AlertDialog
    isOpen={open}
    leastDestructiveRef={closeRef}
    onClose={onClose}
  >
    <AlertDialogOverlay/>
    <AlertDialogContent>
      <AlertDialogHeader>삭제</AlertDialogHeader>
      <AlertDialogBody>
        <Text>"{video ? video.title : ''}" 동영상을 삭제하시겠습니까?</Text>
      </AlertDialogBody>
      <AlertDialogFooter>
        <ButtonGroup>
          <Button variant='outline' isDisabled={loading} onClick={onClose}>취소</Button>
          <Button isLoading={loading} onClick={() => onConfirm(video)}>삭제</Button>
        </ButtonGroup>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>;
};

export default VideoDeleteAlert;
