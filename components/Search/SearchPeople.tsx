import React from 'react'
import Link from 'next/link'
import Spinner from '../../utils/Spinner'
import RoomImage from '../Images/RoomImage'
import { useGetSearchPeople } from '../../lib/ReactQuery'
import { RiEmotionSadLine, RiSearchLine } from 'react-icons/ri'

const SearchPeople = () => {
  
  const [searchTerm, setSearchTerm] = React.useState('')
  const [isDisplay, setIsDisplay] = React.useState(false)

  const { data: users, isLoading, isError } = useGetSearchPeople(searchTerm)

  const handleChange = async (e: { target: { value: any } }) => {
    setSearchTerm(e.target.value)
    if(!e.target.value) {
      setIsDisplay(false)
    } else {
      setIsDisplay(true)
    }
  }

  const searchResults = !searchTerm ? users : users?.filter((user: any) => 
    user.name.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase())
  )

  return (
    <React.Fragment>
      <span className="inline-flex items-center w-full px-3 py-2 z-20 space-x-2 rounded-lg text-zinc-800 dark:text-zinc-100 bg-tomato-light dark:bg-tomato-dark-secondary border border-transparent focus-within:border-tomato-orange">
        <input
          type="text"
          className="w-full p-0.5 outline-none bg-transparent text-sm"
          placeholder="Search People"
          value={searchTerm}
          onChange={handleChange}
        />
        <RiSearchLine className="w-4 h-4 text-zinc-400" />
      </span>
      {isDisplay && (
        <React.Fragment>
          <button 
            className={`${isDisplay ? 'z-10 block fixed inset-0 w-full h-full cursor-default focus:outline-none' : 'hidden'}`}
            type="button"
            onClick={() => {
              setIsDisplay(false)
              setSearchTerm('')
            }} 
          />
          <div className="absolute top-11 z-20 w-full backdrop-blur-xl dark:backdrop-blur-sm bg-opacity-80">
            <div className="flex w-full h-full max-h-[20rem] overflow-y-auto rounded-md border back-shadow shadow-lg bg-white dark:bg-tomato-dark-secondary focus:outline-none">
              <div className="flex flex-col w-full divide-y divide-zinc-100 dark:divide-[#464A4D]">
                <div className="w-full p-3">
                  <h3 className="font-light text-xs">Search results</h3>
                </div>
                {isLoading && (
                  <div className="flex flex-col items-center justify-center w-full p-5 space-y-2">
                    <Spinner width={35} height={35} color={'#F16506'} />
                    <p className="font-light text-xs">Searching...</p>
                  </div>
                )}
                {isError && (
                  <div className="flex flex-col items-center justify-center w-full p-5 space-y-2">
                    <RiEmotionSadLine className="w-10 h-10 text-purple-500" />
                    <p className="font-light text-xs">Failed to load, try to search again.</p>
                  </div>
                )}
                {searchResults?.map(( user: {id: string, name: string, image: string, username: string}, i: number ) => (
                  <Link
                    key={i}
                    href={`/profile/${user.id}`}
                  >
                    <a
                      className="inline-flex items-center space-x-2 p-2 font-light text-sm text-left cursor-pointer transition ease-in-out duration-200 hover:bg-zinc-100 dark:hover:bg-[#464A4D]"
                      onClick={() => {
                        setIsDisplay(false)
                        setSearchTerm('')
                      }}
                    >
                      <RoomImage src={ user.image } />
                      <div className="flex flex-col">
                        <span className="font-normal">{ user.name }</span>
                        {user.username && (
                          <span>@{ user.username }</span>
                        )}
                      </div>
                    </a>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </React.Fragment>
      )}
    </React.Fragment>
  )
}

export default SearchPeople