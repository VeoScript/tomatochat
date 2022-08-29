import React from 'react'

interface IProps {
  title: string
  description: string
  image: string
  url: string
}

const SEO: React.FC<IProps> = ({ title, description, image, url }) => {
  return (
    <React.Fragment>
      <meta name="description" content={description} />
      <meta name="og:title" content={`${title}`} />
      <meta name="og:image:url" content={`${image}`} />
      <meta name="og:description" content={description} />
      <meta name="og:url" content={url} />
      <meta name="og:type" content="website" />
    </React.Fragment>
  )
}

export default SEO