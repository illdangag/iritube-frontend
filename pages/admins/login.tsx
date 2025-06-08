import React, { ChangeEvent, useEffect, useState, KeyboardEvent, } from 'react';
import { GetServerSideProps, } from 'next';
import { useRouter, } from 'next/router';
import {
  Button, Card, CardBody, CardFooter, CardHeader, Flex, Heading, Image, Input, Spacer, useToast, VStack,
} from '@chakra-ui/react';
import { MdLogin, } from 'react-icons/md';
import { EmptyLayout, } from '@root/layouts';

import { GoogleAuthState, useEmailAuth, } from '@root/hooks';
import { TokenInfo, } from '@root/interfaces';
import { getTokenInfoByCookies, } from '@root/utils';

enum PageState {
  IDLE,
  REQUEST,
  SUCCESS,
  FAIL,
}

const AdminsLoginPage = () => {
  const router = useRouter();
  const [authState, requestEmailAuth,] = useEmailAuth();
  const toast = useToast();
  const [pageState, setPageState,] = useState<PageState>(PageState.IDLE);
  const [email, setEmail,] = useState<string>('');
  const [password, setPassword,] = useState<string>('');

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
      toast({
        title: '이메일 또는 비밀번호를 확인해주세요',
        status: 'error',
        duration: 3000,
      });
      setPageState(PageState.FAIL);
    }
  }, [authState,]);

  const onChangeEmail = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const onChangePassword = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const onKeyUpPassword = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      setPageState(PageState.REQUEST);
      void requestEmailAuth(email, password);
    }
  };

  const onClickSignEmail = () => {
    setPageState(PageState.REQUEST);
    void requestEmailAuth(email, password);
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
          <VStack>
            <Input
              autoFocus
              type='email'
              placeholder='아이디'
              size='md'
              value={email}
              isDisabled={pageState === PageState.REQUEST || pageState === PageState.SUCCESS}
              onChange={onChangeEmail}
            />
            <Input
              type='password'
              placeholder='비밀번호'
              size='md'
              value={password}
              isDisabled={pageState === PageState.REQUEST || pageState === PageState.SUCCESS}
              onChange={onChangePassword}
              onKeyUp={onKeyUpPassword}
            />
          </VStack>
        </CardBody>
        <CardFooter>
          <Button
            size='sm'
            width='100%'
            isDisabled={pageState === PageState.REQUEST || pageState === PageState.SUCCESS}
            isLoading={pageState === PageState.REQUEST}
            leftIcon={<MdLogin/>}
            onClick={onClickSignEmail}
          >
            로그인
          </Button>
        </CardFooter>
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

export default AdminsLoginPage;
