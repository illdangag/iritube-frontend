// react
import { ReactNode, useEffect, } from 'react';
import Head from 'next/head';
import { Box, } from '@chakra-ui/react';

// etc
import { Account, TokenInfo, } from '@root/interfaces';
import { useSetRecoilState, } from 'recoil';
import { accountAtom, } from '@root/recoil';
import { getTokenInfo, } from '@root/utils';
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
    void init();
  }, []);

  const init = async () => {
    const tokenInfo: TokenInfo | null = await getTokenInfo();
    if (tokenInfo !== null) {
      const account: Account = await iritubeAPI.getMyAccount(tokenInfo);
      setAccount(account);
    } else {
      setAccount({
        id: '',
        nickname: '',
      } as Account);
    }
  };

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <Box
        paddingLeft='1rem'
        paddingRight='1rem'
        paddingBottom='1rem'
        minHeight='100%'
      >
        {children}
      </Box>
    </>
  );
};

export default EmptyLayout;
