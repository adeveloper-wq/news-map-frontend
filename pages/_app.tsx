import React from 'react'
import { AppProps } from 'next/app'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import '../styles/index.css'

function MyApp({ Component, pageProps }: AppProps) {
  return <>
    <Component {...pageProps}></Component>
    <ToastContainer
      position="bottom-center"
      autoClose={10000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
    />
  </>
}

export default MyApp;