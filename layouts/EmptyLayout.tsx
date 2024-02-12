// react
import { ReactNode, useEffect, } from 'react';
import Head from 'next/head';
import { Box, } from '@chakra-ui/react';

// etc
import { Account, TokenInfo, } from '@root/interfaces';
import { useSetRecoilState, } from 'recoil';
import { accountAtom, } from '@root/recoil';
import { BrowserStorage, } from '@root/utils';
import iritubeAPI from '@root/utils/iritubeAPI';

type Props = {
  children?: ReactNode,
  title?: string,
};

const EmptyLayout = ({
  children,
  title = 'Welcome | iritube',
}: Props) => {
  const setAccount = useSetRecoilState<Account | null>(accountAtom);

  useEffect(() => {
    const tokenInfo: TokenInfo | null = BrowserStorage.getTokenInfo();

    if (tokenInfo !== null) {
      void iritubeAPI.getMyAccount(tokenInfo)
        .then((account: Account) => {
          setAccount(account);
        });
    } else {
      setAccount({
        id: '',
        nickname: '',
      } as Account);
    }

  }, []);

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      {/*<Box paddingLeft='0.8rem' paddingRight='0.8rem' height='100%'>*/}
      <Box
        paddingLeft='1rem'
        paddingRight='1rem'
        // maxWidth={'68rem'}
      >
        {children}
      </Box>
    </>
  );
};

export default EmptyLayout;
