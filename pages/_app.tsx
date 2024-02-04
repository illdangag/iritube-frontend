import { ChakraProvider, } from '@chakra-ui/react';
import { RecoilRoot, } from 'recoil';

const App = ({ Component, pageProps, }) => {
  return (
    <ChakraProvider>
      <RecoilRoot>
        <Component {...pageProps}/>
      </RecoilRoot>
    </ChakraProvider>
  );
};

export default App;
