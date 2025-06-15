import { useRef, useEffect, useState, } from 'react';
import { useRouter, } from 'next/router';
import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Button, ButtonGroup, Textarea, } from '@chakra-ui/react';
import { Video, } from '@root/interfaces';

type Props = {
  video: Video;
  open?: boolean;
  onClose?: () => void;
};

const VideoEmbedPopup = ({
  video,
  open = false,
  onClose = () => {},
}: Props) => {
  const closeRef = useRef();
  const router = useRouter();

  const [embedLink, setEmbedLink,] = useState<string>('');

  useEffect(() => {
    if (router.isReady) {
      setEmbedLink(`<iframe width="560" height="315" src="${window.location.origin}/embed?vk=${video.videoKey}" title="iritube" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`);
    }
  }, [router.isReady, open,]);

  return <AlertDialog leastDestructiveRef={closeRef} isOpen={open} onClose={onClose}>
    <AlertDialogOverlay/>
    <AlertDialogContent>
      <AlertDialogHeader>동영상 공유</AlertDialogHeader>
      <AlertDialogBody>
        <Textarea defaultValue={embedLink} rows={10} resize='none'/>
      </AlertDialogBody>
      <AlertDialogFooter>
        <ButtonGroup>
          <Button onClick={onClose}>닫기</Button>
        </ButtonGroup>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>;
};

export default VideoEmbedPopup;
