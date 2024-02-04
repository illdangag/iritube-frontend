import { Html, Head, Main, NextScript, } from 'next/document';

export default () => {
  return (
    <Html data-color-mode='light'>
      <Head>
        <link rel='icon' href='/static/images/favicon.ico' sizes='any'/>
      </Head>
      <body>
        <Main/>
        <NextScript/>
      </body>
    </Html>
  );
};
