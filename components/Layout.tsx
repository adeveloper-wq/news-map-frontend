import React, { ReactNode } from 'react'
import Head from 'next/head'

type Props = {
  children?: ReactNode
  title?: string
}

const Layout = ({ children, title = 'undefined' }: Props) => {

  return <div>
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
    <div className='static h-full'>
      {children}
      <div className='absolute top-2 left-2'>
        <header className='bg-white py-2 px-4 rounded drop-shadow-md flex flex-row'>
          <h1>
            {title}
          </h1>
        </header>
      </div>
    </div>

  </div>
}

export default Layout
