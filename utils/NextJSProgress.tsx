import React from 'react'
import NextNprogress from 'nextjs-progressbar'

const NextJSProgress: React.FC = () => {
  return (
    <NextNprogress
      color="#F16506
      linear-gradient(
        to right,
        #F16506,
        #E77326,
        #F16506,
        #E77326,
        #F16506
      );"
      startPosition={0.3}
      stopDelayMs={200}
      height={4}
      showOnShallow={true}
      options={{ easing: 'ease', speed: 500 }}
    />
  )
}

export default NextJSProgress