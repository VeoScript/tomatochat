import React from 'react'
import { RiSearchLine } from 'react-icons/ri'

interface IProps {
  searchTerm: any
  setSearchTerm: any
  setIsDisplay: any
}

const SearchInbox: React.FC<IProps> = ({ searchTerm, setSearchTerm, setIsDisplay }) => {

  const handleChange = async (e: { target: { value: any } }) => {
    setSearchTerm(e.target.value)
    if(!e.target.value) {
      setIsDisplay(false)
    } else {
      setIsDisplay(true)
    }
  }

  return (
    <span className="inline-flex items-center w-full px-3 py-2 space-x-2 rounded-lg text-zinc-800 dark:text-zinc-100 bg-tomato-light dark:bg-tomato-dark-secondary border border-transparent focus-within:border-tomato-orange">
      <input
        type="text"
        className="w-full outline-none bg-transparent text-sm"
        placeholder="Search room"
        value={searchTerm}
        onChange={handleChange}
      />
      <RiSearchLine className="w-4 h-4 text-zinc-400" />
    </span>
  )
}

export default SearchInbox