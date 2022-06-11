import React from 'react'
import Image from 'next/image'
import DialogBoxLarge from '../DialogBoxLarge'
import Spinner from '../../../utils/Spinner'

interface IProps {
  imageURL: string
}

const ViewImage: React.FC<IProps> = ({ imageURL }) => {

  let [viewImageIsOpen, setViewImageIsOpen] = React.useState(false)

  const openModal = () => {
    setViewImageIsOpen(true)
  }

  const closeModal = () => {
    setViewImageIsOpen(false)
  }

  const imageLoader = () => {
    return <Spinner width={30} height={30} color={'#4D38A2'} />
  }

  return (
    <DialogBoxLarge
      className="outline-none"
      isOpen={viewImageIsOpen}
      openModal={openModal}
      closeModal={closeModal}
      button={
        <Image
          src={imageURL}
          blurDataURL={imageURL}
          placeholder="blur"
          width={300}
          height={300}
          className="rounded-md object-cover"
          layout="intrinsic"
          quality={100}
          alt="Chat Image"
        />
      }
    >
      <Image
        src={imageURL}
        blurDataURL={imageURL}
        placeholder="blur"
        layout="fill"
        quality={100}
        objectFit="contain"
        alt="Chat Image"
      />
    </DialogBoxLarge>
  )
}

export default ViewImage