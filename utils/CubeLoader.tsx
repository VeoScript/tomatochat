import React from 'react'

const CubeLoader = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="100px" height="100px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
      <g transform="translate(26.666666666666668,26.666666666666668)">
        <rect x="-20" y="-20" width="40" height="40" fill="#BD3207">
          <animateTransform attributeName="transform" type="scale" repeatCount="indefinite" dur="1s" keyTimes="0;1" values="1.1500000000000001;1" begin="-0.3s"></animateTransform>
        </rect>
      </g>
      <g transform="translate(73.33333333333333,26.666666666666668)">
        <rect x="-20" y="-20" width="40" height="40" fill="#F16506">
          <animateTransform attributeName="transform" type="scale" repeatCount="indefinite" dur="1s" keyTimes="0;1" values="1.1500000000000001;1" begin="-0.2s"></animateTransform>
        </rect>
      </g>
      <g transform="translate(26.666666666666668,73.33333333333333)">
        <rect x="-20" y="-20" width="40" height="40" fill="#F16506">
          <animateTransform attributeName="transform" type="scale" repeatCount="indefinite" dur="1s" keyTimes="0;1" values="1.1500000000000001;1" begin="0s"></animateTransform>
        </rect>
      </g>
      <g transform="translate(73.33333333333333,73.33333333333333)">
        <rect x="-20" y="-20" width="40" height="40" fill="#BD3207">
          <animateTransform attributeName="transform" type="scale" repeatCount="indefinite" dur="1s" keyTimes="0;1" values="1.1500000000000001;1" begin="-0.1s"></animateTransform>
        </rect>
      </g>
    </svg>
  )
}

export default CubeLoader