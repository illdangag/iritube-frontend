// react
import './global.scss';
import { ChakraProvider, extendTheme, } from '@chakra-ui/react';
// store
import { RecoilRoot, } from 'recoil';

const theme = extendTheme({
  fonts: {
    heading: '\'Noto Sans KR\', Roboto, sans-serif',
    body: '\'Noto Sans KR\', Roboto, sans-serif',
  },
  styles: {
    global: {
      body: {
        bg: 'gray.100',
      },
    },
  },
  breakpoints: {
    sm: '30rem', // 480px
    md: '48rem', // 768px
    lg: '62rem', // 992px
    xl: '80rem', // 1280px
    '2xl': '96rem', // 1536px
  },
  components: {
    Button: {
      variants: {
        solid: {
          backgroundColor: '#9775fa',
          color: '#f8f9fa',
          _hover: {
            background: '#845ef7',
            color: '#f8f9fa',
            _disabled: {
              background: '#b197fc',
              color: '#f8f9fa',
            },
          },
          _active: {
            background: '#7950f2',
            color: '#f8f9fa',
          },
          _disabled: {
            background: '#b197fc',
            color: '#f8f9fa',
          },
        },
        outline: {
          borderColor: '#b197fc',
          color: '#9775fa',
        },
      },
    },
  },
});

const App = ({ Component, pageProps, }) => {
  return (
    <ChakraProvider theme={theme}>
      <RecoilRoot>
        <Component {...pageProps}/>
      </RecoilRoot>
    </ChakraProvider>
  );
};

export default App;
