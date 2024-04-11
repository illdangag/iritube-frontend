import { useState, useEffect, } from 'react';
import { GetServerSideProps, } from 'next';
import { useRouter, } from 'next/router';
import {
  Box, Button, Card, CardBody, CardHeader, Heading, Spacer, VStack,
} from '@chakra-ui/react';
import { AccountEditor, } from '@root/components';
import { MainLayout, PageHeaderLayout, } from '@root/layouts';

import { Account, TokenInfo, } from '@root/interfaces';
import { useRecoilState, } from 'recoil';
import { accountAtom, } from '@root/recoil';
import { getTokenInfo, getTokenInfoByCookies, removeTokenInfoByCookies, } from '@root/utils';
import iritubeAPI from '@root/utils/iritubeAPI';

enum State {
  IDLE = 'IDLE',
  REQUEST = 'REQUEST',
}

const AccountEditPage = () => {
  const router = useRouter();
  const [account, setAccount,] = useRecoilState<Account>(accountAtom);
  const [updateAccount, setUpdateAccount,] = useState<Account>({
    ...account,
  } as Account);
  const [state, setState,] = useState<State>(State.IDLE);

  useEffect(() => {
    setUpdateAccount({
      ...account,
    });
  }, [account,]);

  const onClickSave = async () => {
    try {
      setState(State.REQUEST);
      const tokenInfo: TokenInfo = await getTokenInfo();
      const updatedAccount: Account = await iritubeAPI.updateMyAccount(tokenInfo, updateAccount.nickname);
      setAccount(updatedAccount);
      void router.push('/settings');
    } catch (error) {
      setState(State.IDLE);
      // TODO 에러 처리
    }
  };

  const onChangeAccount = (account: Account) => {
    setUpdateAccount(account);
  };

  return <MainLayout fullWidth={false}>
    <PageHeaderLayout
      title='내 정보'
      descriptions={['내 계정의 정보를 조회합니다',]}
    />
    <VStack alignItems='stretch'>
      <Card>
        <CardHeader display='flex' flexDirection='row'>
          <Heading size='sm'>내 정보</Heading>
          <Spacer/>
          <Box>
            <Button size='xs' onClick={onClickSave} isDisabled={updateAccount && updateAccount.nickname === '' || state === State.REQUEST}>저장</Button>
          </Box>
        </CardHeader>
        <CardBody alignItems='stretch' paddingTop='0'>
          <AccountEditor value={updateAccount} onChange={onChangeAccount}/>
        </CardBody>
      </Card>
    </VStack>
  </MainLayout>;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const tokenInfo: TokenInfo | null = await getTokenInfoByCookies(context);

  if (tokenInfo === null) {
    return {
      redirect: {
        permanent: false,
        destination: '/login?success=' + encodeURIComponent(context.resolvedUrl),
      },
    };
  }

  try {
    await iritubeAPI.getMyAccount(tokenInfo);
    return {
      props: {},
    };
  } catch {
    removeTokenInfoByCookies(context);
    return {
      redirect: {
        permanent: false,
        destination: '/login?success=' + encodeURIComponent(context.resolvedUrl),
      },
    };
  }
};

export default AccountEditPage;
