import React from 'react'
import { RiSearchLine } from 'react-icons/ri'

interface IProps {
  searchTerm: any
  setSearchTerm: any
  setIsDisplay: any
}

const SearchDiscover: React.FC<IProps> = ({ searchTerm, setSearchTerm, setIsDisplay }) => {

  const handleChange = async (e: { target: { value: any } }) => {
    setSearchTerm(e.target.value)
    if(!e.target.value) {
      setIsDisplay(false)
    } else {
      setIsDisplay(true)
    }
  }

  return (
    <span className="inline-flex items-center w-[23rem] px-3 py-2 z-20 space-x-2 rounded-lg text-zinc-800 dark:text-zinc-400 bg-white dark:bg-[#201A2C] border border-zinc-300 dark:border-transparent focus-within:border-purple-600 dark:focus-within:border-purple-600">
      <input
        type="text"
        className="w-full outline-none bg-transparent text-sm"
        placeholder="Search"
        value={searchTerm}
        onChange={handleChange}
      />
      <RiSearchLine className="w-4 h-4 text-zinc-400" />
    </span>
  )
}

export default SearchDiscover