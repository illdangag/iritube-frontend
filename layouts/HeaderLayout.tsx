import React, { useEffect, useState, } from 'react';
import { useRouter, } from 'next/router';
import NextLink from 'next/link';
import { Flex, Box, Image, Link, Avatar, Button, Menu, MenuButton, MenuList, MenuItem, } from '@chakra-ui/react';

import { useRecoilState, } from 'recoil';
import { myAccountAtom, } from '@root/recoil';
import { Account, TokenInfo, } from '@root/interfaces';
import { BrowserStorage, } from '@root/utils';

type Props = {
};

enum State {
  INIT = 'INIT',
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
}

const HeaderLayout = ({
}: Props) => {
  const router = useRouter();

  const [state, setState,] = useState<State>(State.INIT);
  const [account, setAccount,] = useRecoilState<Account | null>(myAccountAtom);

  useEffect(() => {
    const tokenInfo: TokenInfo | null = BrowserStorage.getTokenInfo();
    if (tokenInfo === null) {
      setState(State.LOGOUT);
    }
  }, []);

  useEffect(() => {
    if (account !== null) {
      setState(State.LOGIN);
    } else {
      setState(State.LOGOUT);
    }
  }, [account,]);

  const logout = () => {
    setAccount(null);
    BrowserStorage.setTokenInfo(null);
    setState(State.LOGOUT);
    void router.push('/');
  };

  return <Flex flexDirection='row' justifyContent='space-between' alignItems='center' paddingTop='0.8rem' paddingBottom='0.8rem'>
    <Box>
      <Link as={NextLink} marginRight='auto' href='/' _hover={{ textDecoration: 'none', }}>
        <Image src='/static/images/main.png' boxSize='2rem'/>
      </Link>
    </Box>
    {state === State.LOGOUT && <Link as={NextLink} href={`/login?success=${encodeURIComponent(router.asPath)}`} size='sm'>
      <Button size='sm'>login</Button>
    </Link>}
    {state === State.LOGIN && account && <Box>
      <Menu>
        <MenuButton>
          <Avatar name={account.nickname} size='sm'/>
        </MenuButton>
        <MenuList>
          <MenuItem onClick={logout}>Logout</MenuItem>
        </MenuList>
      </Menu>
    </Box>}
  </Flex>;
};

export default HeaderLayout;
