import { GetServerSideProps, } from 'next';
import {
  Button, Card, CardBody, CardHeader, Heading, Link, Spacer, VStack,
} from '@chakra-ui/react';
import { MainLayout, PageHeaderLayout, } from '@root/layouts';
import { AccountEditor, } from '@root/components';

import { Account, TokenInfo, } from '@root/interfaces';
import { useRecoilValue, } from 'recoil';
import { accountAtom, } from '@root/recoil';
import { getTokenInfoByCookies, removeTokenInfoByCookies, iritubeAPI, } from '@root/utils';
import NextLink from 'next/link';

const AccountsPage = () => {
  const account: Account = useRecoilValue(accountAtom);

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
          <Link as={NextLink} href={'/settings/edit'}>
            <Button size='xs' variant='outline'>수정</Button>
          </Link>
        </CardHeader>
        <CardBody alignItems='stretch' paddingTop='0'>
          <AccountEditor value={account} isDisabled/>
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

export default AccountsPage;
