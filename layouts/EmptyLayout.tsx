// react
import { ReactNode, useEffect, } from 'react';
import Head from 'next/head';
import { Box, } from '@chakra-ui/react';

// etc
import { Account, TokenInfo, } from '@root/interfaces';
import { useSetRecoilState, } from 'recoil';
import { myAccountAtom, } from '@root/recoil';
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
  const setAccount = useSetRecoilState<Account | null>(myAccountAtom);

  useEffect(() => {
    const tokenInfo: TokenInfo | null = BrowserStorage.getTokenInfo();

    if (tokenInfo !== null) {
      void iritubeAPI.getMyAccount(tokenInfo)
        .then((account: Account) => {
          setAccount(account);
        });
    } else {
      setAccount(null);
    }

  }, []);

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <Box paddingLeft='0.8rem' paddingRight='0.8rem'>
        {children}
      </Box>
    </>
  );
};

export default EmptyLayout;
