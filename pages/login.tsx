import { useEffect, useState, } from 'react';
import { GetServerSideProps, } from 'next';
import { useRouter, } from 'next/router';
import { Button, Card, CardBody, CardHeader, Center, Container, Flex, Heading, Spacer, useToast, } from '@chakra-ui/react';
import { FcGoogle, } from 'react-icons/fc';

import { EmptyLayout, } from '@root/layouts';

import { GoogleAuthState, useGoogleAuth, } from '@root/hooks';
import { getTokenInfoByCookies, } from '@root/utils';
import { TokenInfo, } from '@root/interfaces';

enum PageState {
  READY,
  REQUEST,
  SUCCESS,
  FAIL,
}

const LoginPage = () => {
  const router = useRouter();
  const toast = useToast();
  const [authState, requestGoogleAuth,] = useGoogleAuth();
  const [pageState, setPageState,] = useState<PageState>(PageState.READY);

  const { success, } = router.query;

  useEffect(() => {
    if (authState === GoogleAuthState.SUCCESS) {
      setPageState(PageState.SUCCESS);

      toast({
        title: '로그인 하였습니다',
        status: 'success',
        duration: 3000,
      });

      if (typeof success === 'string') {
        void router.replace(decodeURIComponent(success));
      } else {
        void router.replace('/');
      }
    } else if (authState === GoogleAuthState.FAIL) {
      setPageState(PageState.FAIL);
    }
  }, [authState,]);

  const onClickSignInGoogle = () => {
    setPageState(PageState.REQUEST);
    void requestGoogleAuth();
  };

  return <EmptyLayout>
    <Flex flexDirection='column' height='100%'>
      <Spacer/>
      <Container>
        <Card maxWidth='32rem' marginLeft='auto' marginRight='auto' variant='outline'>
          <CardHeader>
            <Flex flexDirection='column' align='center'>
              <Heading size='md' color='gray.600'>Iritube에 로그인</Heading>
            </Flex>
          </CardHeader>
          <CardBody>
            <Center>
              <Button
                leftIcon={<FcGoogle/>}
                onClick={onClickSignInGoogle}
                isDisabled={pageState === PageState.REQUEST || pageState === PageState.SUCCESS}
                isLoading={pageState === PageState.REQUEST}
              >
                Continue with Google
              </Button>
            </Center>
          </CardBody>
        </Card>
      </Container>
      <Spacer/>
    </Flex>
  </EmptyLayout>;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const tokenInfo: TokenInfo | null = await getTokenInfoByCookies(context);

  if (tokenInfo !== null) {
    return {
      redirect: {
        permanent: false,
        destination: '/',
      },
    };
  } else {
    return {
      props: {},
    };
  }
};

export default LoginPage;
