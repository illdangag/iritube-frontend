import { ChangeEvent, useState, } from 'react';
import {
  Box, Button, FormControl, FormLabel, HStack, Input, Text, Textarea, VStack,
} from '@chakra-ui/react';
import { useDropzone, } from 'react-dropzone';

import { Video, } from '@root/interfaces';

type Props = {
  defaultVideo?: Video,
  disabled?: boolean,
  onRequest?: (video: Video, file: File) => void,
}

const VideoEditor = ({
  defaultVideo,
  disabled = false,
  onRequest = () => {},
}: Props) => {
  const { acceptedFiles, getRootProps, getInputProps, } = useDropzone({
    disabled: disabled,
  });
  const [title, setTitle,] = useState<string>(defaultVideo ? defaultVideo.title : '');
  const [description, setDescription,] = useState<string>(defaultVideo ? defaultVideo.description : '');

  const onChangeTitle = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const onChangeDescription = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(event.target.value);
  };

  const onClickUpload = async () => {
    const video = new Video();
    video.title = title;
    video.description = description;

    if (defaultVideo) {
      video.videoKey = defaultVideo.videoKey;
    }

    onRequest(video, acceptedFiles[0]);
  };

  return <VStack alignItems='stretch' gap='1rem'>
    <VStack gap='1rem'>
      {!defaultVideo && <Box width='100%' cursor='pointer'>
        <Text as='label' display='block' marginBottom='0.5rem' marginInlineEnd='0.75rem' fontWeight='500'>동영상 파일</Text>
        <Box width='100%' height='100%' borderWidth='1px' borderRadius='lg' {...getRootProps()}>
          <input {...getInputProps()}/>
          <VStack padding='2rem'>
            <Text>{acceptedFiles.length === 0 ? '파일을 드래그 앤 드롭하거나 클릭하여 파일을 선택하세요' : acceptedFiles[0].name}</Text>
          </VStack>
        </Box>
      </Box>}
      <FormControl>
        <FormLabel>제목</FormLabel>
        <Input type='title' value={title} disabled={disabled} onChange={onChangeTitle}/>
      </FormControl>
      <FormControl>
        <FormLabel>설명</FormLabel>
        <Textarea resize='none' value={description} disabled={disabled} onChange={onChangeDescription}/>
      </FormControl>
    </VStack>
    <HStack paddingTop='0' justifyContent='end'>
      <Button
        size='sm'
        isDisabled={disabled || (!defaultVideo && acceptedFiles.length === 0) || title === ''}
        onClick={onClickUpload}
      >
        {!defaultVideo ? '업로드' : '수정'}
      </Button>
    </HStack>
  </VStack>;
};

export default VideoEditor;
