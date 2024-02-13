// react
import { Flex, Image, Text, VStack, } from '@chakra-ui/react';
import { EmptyLayout, } from '@root/layouts';

const page404 = () => {

  return <EmptyLayout>
    <Flex width='100%' height='100%' flexDirection='column' justifyContent='center' alignItems='center'>
      <VStack alignItems='center'>
        <Text fontSize='2xl' fontWeight='bold'>404 Not found!</Text>
        <Image
          src='/static/images/warning.png'
          width='8rem'
          height='8rem'
        />
        <Text fontSize='xl'>페이지를 찾을 수 없습니다</Text>
      </VStack>
    </Flex>
  </EmptyLayout>;
};

export default page404;
