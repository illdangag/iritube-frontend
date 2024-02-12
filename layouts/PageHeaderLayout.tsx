import { Box, Heading, HStack, Text, } from '@chakra-ui/react';

type Props = {
  title: string,
  descriptions?: string[],
};

const PageHeaderLayout = ({
  title,
  descriptions = [],
}: Props) => {
  return (<HStack justifyContent='space-between' alignItems='end' marginBottom='1rem'>
    <Box>
      <Heading size='md' fontWeight='semibold'>{title}</Heading>
      {descriptions.map((description, index) => <Text key={index} fontSize='xs'>{description}</Text>)}
    </Box>
  </HStack>);
};

export default PageHeaderLayout;
