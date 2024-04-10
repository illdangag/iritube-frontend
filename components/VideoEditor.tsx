import { ChangeEvent, useState, KeyboardEvent, useEffect, } from 'react';
import {
  Box, FormControl, FormHelperText, FormLabel, HStack, Input, Radio, RadioGroup, Tag, TagCloseButton, TagLabel,
  Text, Textarea, VStack,
} from '@chakra-ui/react';
import { useDropzone, } from 'react-dropzone';

import { Video, VideoShare, } from '@root/interfaces';

type Props = {
  video?: Video,
  mode?: 'create' | 'edit',
  isDisabled?: boolean,
  isLoading?: boolean,
  onChange?: (video: Video, file: File) => void,
}

const VideoEditor = ({
  video = new Video(),
  mode = 'create',
  isDisabled = false,
  onChange = () => {},
}: Props) => {
  const { acceptedFiles, getRootProps, getInputProps, } = useDropzone({
    disabled: isDisabled,
  });
  const [editVideo, setEditVideo,] = useState<Video>(video);
  const [tag, setTag,] = useState<string>('');

  useEffect(() => {
    onChange(editVideo, acceptedFiles[0]);
  }, [editVideo, acceptedFiles,]);

  const onChangeTitle = (event: ChangeEvent<HTMLInputElement>) => {
    setEditVideo({
      ...editVideo,
      title: event.target.value,
    } as Video);
  };

  const onChangeDescription = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setEditVideo({
      ...editVideo,
      description: event.target.value,
    } as Video);
  };

  const onChangeShare = (nextValue: VideoShare) => {
    setEditVideo({
      ...editVideo,
      share: nextValue,
    } as Video);
  };

  const onChangeTag = (event: ChangeEvent<HTMLInputElement>) => {
    setTag(event.target.value);
  };

  const onKeyUpTag = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && tag !== '') {
      const newTagList = [
        ...editVideo.tags,
        tag.trim(),
      ];
      const distinctTagList = newTagList.filter((tag, index) => newTagList.indexOf(tag) === index);
      setTag('');
      setEditVideo({
        ...editVideo,
        tags: distinctTagList,
      } as Video);
    }
  };

  const onClickTagDelete = (deleteTag: string) => {
    const newTagList = video.tags.filter((tag) => tag !== deleteTag);
    setEditVideo({
      ...editVideo,
      tags: newTagList,
    } as Video);
  };

  return <VStack alignItems='stretch' gap='1rem'>
    <VStack gap='1rem'>
      {mode === 'create' && <Box width='100%' cursor='pointer'>
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
        <Input type='title' value={editVideo.title} isDisabled={isDisabled} onChange={onChangeTitle}/>
      </FormControl>
      <FormControl>
        <FormLabel>설명</FormLabel>
        <Textarea resize='none' value={editVideo.description} isDisabled={isDisabled} onChange={onChangeDescription}/>
      </FormControl>
      <FormControl>
        <FormLabel>태그</FormLabel>
        <Input type='text' value={tag} isDisabled={isDisabled} onChange={onChangeTag} onKeyUp={onKeyUpTag}/>
        <FormHelperText>'Enter'버튼을 눌러 태그를 추가하세요</FormHelperText>
        <HStack alignItems='start' marginTop='0.4rem'>
          {editVideo.tags.map((tag, index) => <Tag key={index} marginRight='0.4rem' marginBottom='0.4rem'>
            <TagLabel>{tag}</TagLabel>
            <TagCloseButton isDisabled={isDisabled} onClick={() => onClickTagDelete(tag)}/>
          </Tag>)}
        </HStack>
      </FormControl>
      <FormControl>
        <FormLabel>공유</FormLabel>
        <RadioGroup value={editVideo.share} isDisabled={isDisabled} onChange={onChangeShare}>
          <HStack>
            <Radio value={VideoShare.PUBLIC}>공개</Radio>
            <Radio value={VideoShare.URL}>링크 공유</Radio>
            <Radio value={VideoShare.PRIVATE}>비공개</Radio>
          </HStack>
        </RadioGroup>
      </FormControl>
    </VStack>
  </VStack>;
};

export default VideoEditor;
