import React from 'react'
import { RiImage2Line } from 'react-icons/ri'

interface IProps {
  handleAddImage: any
}

const PostUpload: React.FC<IProps> = ({ handleAddImage }) => {

  return (
    <React.Fragment>
      <label
        htmlFor="uploadProfile"
        className="mt-2 text-zinc-400 transition ease-in-out duration-200 transform hover:scale-95"
      >
        <RiImage2Line className="w-6 h-6" />
      </label>
      <input
        type="file"
        id="uploadProfile"
        className="hidden"
        onChange={handleAddImage}
        accept=".jpg, .png, .jpeg, .jfif"
        multiple
      />
    </React.Fragment>
  )
}

export default PostUpload