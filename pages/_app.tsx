import "@/styles/globals.css";
import "@/styles/fontstyles.css";
import type { AppProps } from "next/app";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Head from "next/head";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Retrospect</title>
        <meta name="description" content="Digital time capsules to help you document the moments that matter."></meta>
        <meta charSet="UTF-8"></meta>
        <meta name="keywords" content="retrospect, space, capsules, time"></meta>
        <meta name="author" content="Tenacity Labs"></meta>
        <meta name="theme-color" content="#000000"></meta>
      </Head>
      <ToastContainer />
      <Component {...pageProps} />
    </>
  )
}
