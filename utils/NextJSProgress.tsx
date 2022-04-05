import React from 'react'
import NextNprogress from 'nextjs-progressbar'

const NextJSProgress: React.FC = () => {
  return (
    <NextNprogress
      color="#3F86C7
      linear-gradient(
        to right,
        #3F86C7,
        #4D38A2,
        #3F86C7,
        #4D38A2,
        #3F86C7
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