import '../styles/tailwind.css'
import NextJSProgress from '../utils/NextJSProgress'
import type { AppProps } from 'next/app'
import { ThemeProvider } from 'next-themes'
import { SessionProvider } from 'next-auth/react'
import { QueryClient, QueryClientProvider } from 'react-query'

const queryClient = new QueryClient()

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider session={pageProps.session}>
        <ThemeProvider attribute="class">
          <NextJSProgress />
          <Component {...pageProps} />
        </ThemeProvider>
      </SessionProvider>
    </QueryClientProvider>
  )
}

export default MyApp
