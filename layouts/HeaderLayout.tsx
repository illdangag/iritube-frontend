import React, { useEffect, useState, } from 'react';
import { useRouter, } from 'next/router';
import NextLink from 'next/link';
import {
  Flex, Box, Image, Link, Avatar, Button, Menu, MenuButton, MenuList, MenuItem, IconButton, HStack, Drawer,
  DrawerOverlay, DrawerContent, DrawerBody, VStack, Heading, Divider,
} from '@chakra-ui/react';
import { MdAdd, MdMenu, } from 'react-icons/md';
import { PlayListCreateAlert, } from '@root/components/alerts';

import { useRecoilState, } from 'recoil';
import { accountAtom, playListListAtom, } from '@root/recoil';
import { Account, PlayListList, TokenInfo, } from '@root/interfaces';
import { BrowserStorage, } from '@root/utils';
import iritubeAPI from '@root/utils/iritubeAPI';

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
  const [account, setAccount,] = useRecoilState<Account | null>(accountAtom);
  const [playListList, setPlayListList,] = useRecoilState<PlayListList | null>(playListListAtom);
  const [isOpenMenu, setOpenMenu,] = useState<boolean>(false);
  const [openPlayListCreateAlert, setOpenPlayListCreateAlert,] = useState<boolean>(false);

  useEffect(() => {
    const tokenInfo: TokenInfo | null = BrowserStorage.getTokenInfo();
    if (tokenInfo === null) {
      setState(State.LOGOUT);
    }

    void iritubeAPI.getMyPlayListList(tokenInfo, 0, 10)
      .then(playListList => {
        setPlayListList(playListList);
      });
  }, []);

  useEffect(() => {
    if (account && account.id) {
      setState(State.LOGIN);
    } else if (account) {
      setState(State.LOGOUT);
    }
  }, [account,]);

  const logout = () => {
    setAccount({
      id: '',
      nickname: '',
    } as Account);
    BrowserStorage.setTokenInfo(null);
    setState(State.LOGOUT);
    void router.push('/');
  };

  const onClickMenuButton = () => {
    setOpenMenu(true);
  };

  const onCloseMenu = () => {
    setOpenMenu(false);
  };

  const onClickPlayListCreateButton = () => {
    setOpenPlayListCreateAlert(true);
  };

  const onClosePlayListCreateAlert = () => {
    setOpenPlayListCreateAlert(false);
  };

  const onConfirmPlayListCreateAlert = () => {
    setOpenPlayListCreateAlert(false);
  };

  const onClickPlayList = () => {
    setOpenMenu(false);
  };

  return <>
    <Flex flexDirection='row' justifyContent='space-between' alignItems='center' paddingTop='0.8rem' paddingBottom='0.8rem'>
      <HStack>
        <IconButton aria-label='menu' icon={<MdMenu/>} variant='ghost' onClick={onClickMenuButton}/>
        <Link as={NextLink} marginRight='auto' href='/' _hover={{ textDecoration: 'none', }}>
          <Image src='/static/images/main.png' boxSize='2rem'/>
        </Link>
      </HStack>
      {state === State.LOGOUT && <Link as={NextLink} href={`/login?success=${encodeURIComponent(router.asPath)}`} size='sm'>
        <Button size='sm' variant='outline'>로그인</Button>
      </Link>}
      {state === State.LOGIN && account && <Box>
        <Menu>
          <MenuButton>
            <Avatar name={account.nickname} size='sm'/>
          </MenuButton>
          <MenuList>
            <NextLink href='/accounts'>
              <MenuItem>내 정보</MenuItem>
            </NextLink>
            <NextLink href='/accounts/videos'>
              <MenuItem>동영상 목록</MenuItem>
            </NextLink>
            <MenuItem onClick={logout}>로그아웃</MenuItem>
          </MenuList>
        </Menu>
      </Box>}
    </Flex>
    <Drawer placement='left' isOpen={isOpenMenu} onClose={onCloseMenu}>
      <DrawerOverlay/>
      <DrawerContent>
        <DrawerBody>
          <VStack marginTop='1rem' alignItems='stretch'>
            <HStack paddingLeft='0.75rem' justifyContent='space-between'>
              <Heading fontSize='sm'>재생 목록</Heading>
              <IconButton
                aria-label='add play list'
                icon={<MdAdd/>}
                size='sm'
                variant='ghost'
                onClick={onClickPlayListCreateButton}
              />
            </HStack>
            <Divider/>
            {playListList && playListList.total === 0 && <>
              <Button
                size='sm'
                variant='outline'
                leftIcon={<MdAdd/>}
                onClick={onClickPlayListCreateButton}
              >
                재생 목록 추가
              </Button>
            </>}
            {playListList && playListList.total > 0 && playListList.playLists.map((playList, index) => <Button
              key={index}
              size='sm'
              variant='ghost'
              justifyContent='start'
              as={NextLink}
              href={`/videos?pk=${playList.playListKey}`}
              onClick={onClickPlayList}
            >
              {playList.title}
            </Button>)}
          </VStack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
    <PlayListCreateAlert
      open={openPlayListCreateAlert}
      onClose={onClosePlayListCreateAlert}
      onConfirm={onConfirmPlayListCreateAlert}
    />
  </>;
};

export default HeaderLayout;
