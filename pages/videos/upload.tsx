import { ChangeEvent, useState, } from 'react';
import { GetServerSideProps, NextPage, } from 'next';
import { useRouter, } from 'next/router';
import {
  Box, Button, Card, CardBody, CardFooter, FormControl, FormLabel, Input, Text, Textarea, VStack,
} from '@chakra-ui/react';
import { useDropzone, } from 'react-dropzone';
import { MainLayout, } from '@root/layouts';

import { TokenInfo, } from '@root/interfaces';
import { getTokenInfo, getTokenInfoByCookies, removeTokenInfoByCookies, } from '@root/utils';
import iritubeAPI from '@root/utils/iritubeAPI';

type Props = {};

enum State {
  IDLE = 'IDLE',
  REQUEST = 'REQUEST',
}

const VideoUploadPage = (props: NextPage<Props>) => {
  const router = useRouter();
  const { acceptedFiles, getRootProps, getInputProps, } = useDropzone();
  const [state, setState,] = useState<State>(State.IDLE);
  const [title, setTitle,] = useState<string>('');
  const [description, setDescription,] = useState<string>('');

  const onClickUpload = async () => {
    setState(State.REQUEST);
    try {
      const tokenInfo: TokenInfo = await getTokenInfo();
      await iritubeAPI.uploadVideo(tokenInfo, acceptedFiles[0], title, description);
      void router.push('/');
    } catch {
      setState(State.IDLE);
    }
  };

  const onChangeTitle = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const onChangeDescription = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(event.target.value);
  };

  return <MainLayout fullWidth={false}>
    <Card>
      <CardBody display='flex' flexDirection='column' gap={2}>
        <Box>
          <Text as='label' display='block' marginBottom='0.5rem' marginInlineEnd='0.75rem' fontWeight='500'>동영상 파일</Text>
          <Box width='100%' height='100%' borderWidth='1px' borderRadius='lg' {...getRootProps({})}>
            <input {...getInputProps()}/>
            <VStack padding='2rem'>
              <Text>{acceptedFiles.length === 0 ? '파일을 드래그 앤 드롭하거나 클릭하여 파일을 선택하세요' : acceptedFiles[0].name}</Text>
            </VStack>
          </Box>
        </Box>
        <FormControl>
          <FormLabel>제목</FormLabel>
          <Input type='title' value={title} onChange={onChangeTitle}/>
        </FormControl>
        <FormControl>
          <FormLabel>설명</FormLabel>
          <Textarea resize='none' value={description} onChange={onChangeDescription}/>
        </FormControl>
      </CardBody>
      <CardFooter paddingTop='0' justifyContent='end'>
        <Button
          size='sm'
          isDisabled={acceptedFiles.length === 0 || state === State.REQUEST || title === ''}
          onClick={onClickUpload}
        >
          업로드
        </Button>
      </CardFooter>
    </Card>
  </MainLayout>;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const tokenInfo: TokenInfo | null = await getTokenInfoByCookies(context);

  if (tokenInfo === null) {
    return {
      redirect: {
        permanent: false,
        destination: '/login?success=' + encodeURIComponent('/videos/upload'),
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
        destination: '/login?success=' + encodeURIComponent('/videos/upload'),
      },
    };
  }
};

export default VideoUploadPage;
