import React from 'react'
import SearchPeople from '../../components/Search/SearchPeople'
import { RiFilter2Fill } from 'react-icons/ri'

const NavBarSearch = () => {
  return (
    <div className="sticky top-0 z-20 flex flex-col items-center justify-center w-full px-2 py-3 rounded-b-xl back-shadow bg-tomato-light-secondary dark:bg-tomato-dark backdrop-blur-xl dark:backdrop-blur-sm bg-opacity-80">
      <div className="inline-flex items-center justify-between w-full mb-2 px-3 text-neutral-600 dark:text-neutral-300">
        <h3 className="font-black text-2xl">Newsfeed</h3>
        <button
          title="Filter"
          type="button"
          className="outline-none"
        >
          <RiFilter2Fill className="w-6 h-6" />
        </button>
      </div>
      <div className="relative flex justify-center w-full">
        <SearchPeople />
      </div>
    </div>
  )
}

export default NavBarSearch