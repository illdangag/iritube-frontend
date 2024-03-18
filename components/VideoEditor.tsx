import { ChangeEvent, useState, KeyboardEvent, } from 'react';
import {
  Box, Button, FormControl, FormHelperText, FormLabel, HStack, Input, Radio, RadioGroup, Tag, TagCloseButton, TagLabel,
  Text, Textarea,
  VStack,
} from '@chakra-ui/react';
import { useDropzone, } from 'react-dropzone';

import { Video, VideoShare, } from '@root/interfaces';

type Props = {
  defaultVideo?: Video,
  disabled?: boolean,
  loading?: boolean,
  onRequest?: (video: Video, file: File) => void,
}

const VideoEditor = ({
  defaultVideo,
  disabled = false,
  loading = false,
  onRequest = () => {},
}: Props) => {
  const { acceptedFiles, getRootProps, getInputProps, } = useDropzone({
    disabled: disabled,
  });

  const [title, setTitle,] = useState<string>(defaultVideo ? defaultVideo.title : '');
  const [description, setDescription,] = useState<string>(defaultVideo ? defaultVideo.description : '');
  const [share, setShare,] = useState<VideoShare>(defaultVideo ? defaultVideo.share : VideoShare.PUBLIC);
  const [tag, setTag,] = useState<string>('');
  const [tagList, setTagList,] = useState<string[]>(defaultVideo ? defaultVideo.tags : []);

  const onChangeTitle = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const onChangeDescription = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(event.target.value);
  };

  const onChangeShare = (nextValue: VideoShare) => {
    setShare(nextValue);
  };

  const onChangeTag = (event: ChangeEvent<HTMLInputElement>) => {
    setTag(event.target.value);
  };

  const onKeyUpTag = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && tag !== '') {
      const newTagList = [
        ...tagList,
        tag.trim(),
      ];
      const distinctTagList = newTagList.filter((tag, index) => newTagList.indexOf(tag) === index);
      setTagList(distinctTagList);
      setTag('');
    }
  };

  const onClickTagDelete = (deleteTag: string) => {
    const newTagList = tagList.filter((tag) => tag !== deleteTag);
    setTagList(newTagList);
  };

  const onClickConfirm = async () => {
    const video = new Video();
    video.title = title;
    video.description = description;
    video.share = share;
    video.tags = tagList;

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
      <FormControl>
        <FormLabel>태그</FormLabel>
        <Input type='text' value={tag} disabled={disabled} onChange={onChangeTag} onKeyUp={onKeyUpTag}/>
        <FormHelperText>'Enter'버튼을 눌러 태그를 추가하세요</FormHelperText>
        <HStack alignItems='start' marginTop='0.4rem'>
          {tagList.map((tag, index) => <Tag key={index} marginRight='0.4rem' marginBottom='0.4rem'>
            <TagLabel>{tag}</TagLabel>
            <TagCloseButton onClick={() => onClickTagDelete(tag)}/>
          </Tag>)}
        </HStack>
      </FormControl>
      <FormControl>
        <FormLabel>공유</FormLabel>
        <RadioGroup value={share} isDisabled={disabled} onChange={onChangeShare}>
          <HStack>
            <Radio value={VideoShare.PUBLIC}>공개</Radio>
            <Radio value={VideoShare.URL}>링크 공유</Radio>
            <Radio value={VideoShare.PRIVATE}>비공개</Radio>
          </HStack>
        </RadioGroup>
      </FormControl>
    </VStack>
    <HStack paddingTop='0' justifyContent='end'>
      <Button
        size='sm'
        isDisabled={disabled || (!defaultVideo && acceptedFiles.length === 0) || title === ''}
        isLoading={loading}
        onClick={onClickConfirm}
      >
        {!defaultVideo ? '업로드' : '수정'}
      </Button>
    </HStack>
  </VStack>;
};

export default VideoEditor;
