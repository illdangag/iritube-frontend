import { useState, useEffect, ChangeEvent, } from 'react';
import { StackProps, VStack, Textarea, } from '@chakra-ui/react';

import { VideoComment, } from '@root/interfaces';

interface Props extends Omit<StackProps, 'onChange'> {
  isDisabled?: boolean;
  value?: VideoComment;
  placeholder?: string;
  onChange?: (videoComment: VideoComment) => void;
}

const VideoCommentEditor = (props: Props) => {
  const isDisabled: boolean = props.isDisabled === undefined ? false : props.isDisabled;
  const placeholder: string = props.placeholder || '';
  const onChange: (videoComment: VideoComment) => void = props.onChange || (() => {});

  const videoComment: VideoComment = props.value ? props.value : new VideoComment();
  const [editVideoComment, setEditVideoComment,] = useState<VideoComment>(videoComment);

  useEffect(() => {
    setEditVideoComment(videoComment);
  }, [videoComment,]);

  useEffect(() => {
    onChange(editVideoComment);
  }, [editVideoComment,]);

  const onChangeComment = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setEditVideoComment({
      ...editVideoComment,
      comment: event.target.value,
    } as VideoComment);
  };

  const getStackProps = (): StackProps => {
    const stackProps: Props = {
      ...props,
    };

    delete stackProps.onChange;
    delete stackProps.isDisabled;

    return stackProps as unknown as StackProps;
  };

  return <VStack {...getStackProps()}>
    <Textarea
      resize='none'
      size='sm'
      value={editVideoComment.comment}
      isDisabled={isDisabled}
      onChange={onChangeComment}
      placeholder={placeholder}
    />
  </VStack>;
};

export default VideoCommentEditor;
