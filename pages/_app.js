import '../styles/globals.css'
import NextNProgress from "nextjs-progressbar";
import { SessionProvider } from "next-auth/react"
export default function MyApp({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <>
    <SessionProvider session={session} refetchInterval={5 * 60}>
    <NextNProgress color="#fff" />
      <Component {...pageProps} />
    </SessionProvider>

    </>
  );
}