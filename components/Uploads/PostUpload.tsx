import React from 'react'
import { RiImage2Line } from 'react-icons/ri'

interface IProps {
  handleAddImage: any
}

const PostUpload: React.FC<IProps> = ({ handleAddImage }) => {

  return (
    <React.Fragment>
      <label
        title="Media"
        htmlFor="uploadPostMultiple"
        className="cursor-pointer text-tomato-orange transition ease-in-out duration-200 transform hover:scale-95"
      >
        <RiImage2Line className="w-6 h-6" />
      </label>
      <input
        type="file"
        id="uploadPostMultiple"
        className="hidden"
        onChange={handleAddImage}
        accept=".jpg, .png, .jpeg, .jfif"
        multiple
      />
    </React.Fragment>
  )
}

export default PostUpload