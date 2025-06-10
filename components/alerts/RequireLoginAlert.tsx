import { useRef, } from 'react';
import { useRouter, } from 'next/router';
import NextLink from 'next/link';
import { AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogBody, AlertDialogFooter, ButtonGroup, Button,
  Text, Link, } from '@chakra-ui/react';

type Props = {
  open?: boolean;
  message?: string;
  onClose?: () => void;
}

const RequireLoginAlert = ({
  open = false,
  message = '',
  onClose = () => {},
}: Props) => {
  const closeRef = useRef();
  const router = useRouter();

  return (
    <AlertDialog isOpen={open} leastDestructiveRef={closeRef} onClose={onClose}>
      <AlertDialogOverlay/>
      <AlertDialogContent>
        <AlertDialogHeader>저런!</AlertDialogHeader>
        <AlertDialogBody>
          {message && <Text>{message}</Text>}
          <Text>로그인 페이지로 이동하시겠습니까?</Text>
        </AlertDialogBody>
        <AlertDialogFooter>
          <ButtonGroup>
            <Button variant='outline' onClick={onClose}>취소</Button>
            <Link as={NextLink} href={`/login?success=${encodeURIComponent(router.asPath)}`}>
              <Button>로그인</Button>
            </Link>
          </ButtonGroup>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default RequireLoginAlert;
