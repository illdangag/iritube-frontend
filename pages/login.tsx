import React, { useEffect, useState, } from 'react';
import { GetServerSideProps, } from 'next';
import { useRouter, } from 'next/router';
import { Button, Card, CardBody, CardHeader, Center, Image, Flex, Heading, Spacer, useToast, VStack, Text, } from '@chakra-ui/react';
import { FcGoogle, } from 'react-icons/fc';
import { EmptyLayout, } from '@root/layouts';

import { GoogleAuthState, useGoogleAuth, } from '@root/hooks';
import { getTokenInfoByCookies, } from '@root/utils';
import { TokenInfo, } from '@root/interfaces';

enum PageState {
  IDLE,
  REQUEST,
  SUCCESS,
  FAIL,
}

const LoginPage = () => {
  const router = useRouter();
  const toast = useToast();
  const [authState, requestGoogleAuth,] = useGoogleAuth();
  const [pageState, setPageState,] = useState<PageState>(PageState.IDLE);

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

  return <EmptyLayout title='Login | iritube'>
    <VStack flexDirection='column' height='100vh'>
      <Spacer/>
      <Card width='100%' maxWidth='28rem'>
        <CardHeader>
          <Flex flexDirection='column' align='center' gap='3'>
            <Image src='/static/images/main.png' boxSize='5rem'/>
            <Heading size='lg'>Iritube</Heading>
          </Flex>
        </CardHeader>
        <CardBody>
          <Center>
            <Button
              size='sm'
              leftIcon={<FcGoogle/>}
              onClick={onClickSignInGoogle}
              isDisabled={pageState === PageState.REQUEST || pageState === PageState.SUCCESS}
              isLoading={pageState === PageState.REQUEST}
            >
              Google 계정으로 계속하기
            </Button>
          </Center>
        </CardBody>
      </Card>
      <Spacer/>
      <Spacer/>
    </VStack>
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
