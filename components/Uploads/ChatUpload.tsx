import React from 'react'
import { RiImageLine } from 'react-icons/ri'

interface IProps {
  handleAddImage: any
}

const ChatUpload: React.FC<IProps> = ({ handleAddImage }) => {

  return (
    <React.Fragment>
      <label
        title="Media"
        htmlFor="uploadChatMultiple"
        className="mt-2 cursor-pointer text-tomato-orange transition ease-in-out duration-200 transform hover:scale-95"
      >
        <RiImageLine className="w-6 h-6" />
      </label>
      <input
        type="file"
        id="uploadChatMultiple"
        className="hidden"
        onChange={handleAddImage}
        accept=".jpg, .png, .jpeg, .jfif"
        multiple
      />
    </React.Fragment>
  )
}

export default ChatUpload