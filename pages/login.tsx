import type { NextPage, GetServerSideProps, GetServerSidePropsContext } from 'next'
import { Fragment } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import StaticLayout from '../layouts/Static'
import LoadingPage from '../layouts/Loading'
import AuthenticationError from '../components/AuthenticationError'
import { useRouter } from 'next/router'
import { getProviders, signIn, getSession, useSession } from 'next-auth/react'
import { FcGoogle } from 'react-icons/fc'
import { RiFacebookFill } from 'react-icons/ri'
import { errors } from '../utils/NextAuthCustomErrors'

interface IProps {
  providers: any
}

const Login: NextPage<IProps> = ({ providers }) => {

  const { status } = useSession()
  const { error } = useRouter().query

  if (status === 'loading') {
    return (
      <LoadingPage />
    )
  }

  return (
    <Fragment>
      <Head>
        <title>TomatoChat (Login)</title>
      </Head>
      <StaticLayout>
        {error && (
          <AuthenticationError error={error} errors={errors} />
        )}
        <div className="flex flex-col w-full space-y-2">
          {Object.values(providers).map((provider: any) => (
            <div className="flex justify-center w-full" key={provider.name}>
              <button
                className={`flex items-center space-x-5 p-4 rounded-md w-[21rem] transition ease-in-out hover:bg-opacity-80 dark:hover:bg-opacity-90 ${provider.name === 'Google' && 'text-black bg-white dark:bg-white'} ${provider.name === 'Facebook' && 'bg-blue-600 text-white'}`}
                onClick={() => signIn(provider.id)}
              >
                {provider.name === 'Google' && (
                  <FcGoogle className="w-5 h-5" />
                )}
                {provider.name === 'Facebook' && (
                  <RiFacebookFill className="w-5 h-5 text-white" />
                )}
                <p className="font-light text-sm text-center">Continue with {provider.name}</p>
              </button>
            </div>
          ))}
          <div className="flex flex-col items-center justify-center w-full pt-3">
            <p className="font-light text-[11px] text-zinc-800 dark:text-white text-center">
              By using TomatoChat you agree to its&nbsp;
              <Link href="/">
                <a className="text-tomato-orange hover:underline">Terms of Service</a>
              </Link>
              &nbsp;and&nbsp;
              <Link href="/">
                <a className="text-tomato-orange hover:underline">Privacy Policy</a>
              </Link>
            </p>
            <p className="font-light text-zinc-800 dark:text-zinc-100 text-[11px]">&copy; 2022 TomatoChat. All rights reserved.</p>
          </div>
        </div>
      </StaticLayout>
    </Fragment>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const providers = await getProviders()
  const session = await getSession(ctx)

  if (session) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }

  return {
    props: {
      providers
    }
  }
}

export default Login
