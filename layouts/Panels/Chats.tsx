import React from 'react'
import AutoScroll from '@brianmcallister/react-auto-scroll'
import Profile from '../../components/Images/Profile'
import RoomImage from '../../components/Images/RoomImage'
import { useForm } from 'react-hook-form'
import { RiSettingsLine, RiSendPlane2Line } from 'react-icons/ri'
import { messages } from '../../mock/messages'

interface FormData {
  chatbox: string
}

const Chats = () => {

  const { handleSubmit, register, reset, setValue, formState: { errors, isSubmitting } } = useForm<FormData>()

  React.useEffect(() => {
    register('chatbox', { required: true })
  }, [register])

  const onSendChat = async (formData: FormData) => {
    const chatbox = formData.chatbox
    const contentEditable = document.getElementById('contentEditable')

    if (contentEditable!.innerText.trim().length === 0 || chatbox === '') return

    alert('Message: ' + formData.chatbox)
    reset()

    contentEditable !== null ?
    contentEditable.innerHTML = '' : ''
    contentEditable?.focus()
  }

  const handleLineBreak = (e: any) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(onSendChat)()
    }
  }

  return (
    <div className="flex flex-col w-full max-w-full h-full border-x border-[#1F1836]">
      <div className="inline-flex items-center justify-between w-full p-3 border-b border-[#1F1836] bg-gradient-to-r from-[#1F1E35] to-[#14121E]">
        <span className="inline-flex items-start w-full max-w-lg rounded-xl select-none">
          <div className="flex w-full max-w-[4rem] h-full max-h-[3.5rem]">
            <RoomImage src="https://scontent.fceb2-2.fna.fbcdn.net/v/t39.30808-6/245424250_110230208101865_6398027439472231008_n.jpg?_nc_cat=107&ccb=1-5&_nc_sid=e3f864&_nc_eui2=AeGpx62DCDsA1NtrEiehaFm2bkuCYrLg7NluS4JisuDs2Q2SLDKuSiT9cwVmZCk4PA5dYt3dvgx0Qs0LfEEI86av&_nc_ohc=qfZ3eapfHNQAX8bZZbl&_nc_ht=scontent.fceb2-2.fna&oh=00_AT9yfxpNdOMxkET0n_vSDE74vwPBJgg7MIeJB7Iax7C7OA&oe=6251BA7A" />
          </div>
          <div className="block">
            <h3 className="font-light text-base">Web Culture</h3>
            <h3 className="font-light text-xs text-zinc-500">Room for all developers around the world</h3>
          </div>
        </span>
        <button
          title="Settings"
          type="button"
          className="outline-none"
        >
          <RiSettingsLine className="w-6 h-6 text-zinc-600 transition ease-in-out duration-200 transform hover:scale-90" />
        </button>
      </div>
      <AutoScroll
        showOption={false}
        scrollBehavior="auto"
        className="flex flex-col w-full h-full overflow-y-auto scroll-smooth"
      >
        <div className="flex flex-col w-full space-y-3 p-3">
          {messages.map((message: { profile: string, type: string, content: string, date: string }, i: number) => (
            <React.Fragment key={i}>
              {message.type === 'them' && (
                <div className="flex items-start justify-start w-full space-x-2">
                  <div className="flex">
                    <Profile src={message.profile} />
                  </div>
                  <div className="bubble-receiver inline w-full max-w-[15rem] p-3 font-light text-xs rounded-xl bg-[#19182B]">
                    <p>{message.content}</p>
                    <span className="font-thin text-[9px]">{message.date}</span>
                  </div>
                </div>
              )}
              {message.type === 'me' && (
                <div className="flex items-start justify-end w-full space-x-2">
                  <div className="bubble-sender inline w-full max-w-[15rem] p-3 font-light text-xs rounded-xl bg-[#4D38A2]">
                    <p>{message.content}</p>
                    <span className="font-thin text-[9px]">{message.date}</span>
                  </div>
                  <div className="flex">
                    <Profile src={message.profile} />
                  </div>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </AutoScroll>
      <div className="w-full bg-gradient-to-br from-[#1B1325] via-[#12111B] to-[#18132A]">
        <form
          className="inline-flex w-full p-3 space-x-3"
          onSubmit={handleSubmit(onSendChat)}
        >
          <div
            id="contentEditable"
            className="w-full h-full max-h-[15rem] overflow-y-auto cursor-text whitespace-pre-wrap outline-none p-3 font-light text-xs rounded-xl bg-transparent border border-[#1F1836]"
            placeholder="Write a message..."
            title="Shift+Enter to execute new line."
            contentEditable="true"
            suppressContentEditableWarning
            spellCheck={false}
            onPaste={(e) => {
              e.preventDefault()
              var text = e.clipboardData.getData('text/plain')
              document.execCommand('insertText', false, text)
            }}
            onKeyPress={handleLineBreak}
            onInput={(e: any) => setValue('chatbox', e.currentTarget.textContent, { shouldValidate: true })}
          />
          <button
            title="Send"
            type="submit"
            className="outline-none"
          >
            <RiSendPlane2Line className="w-6 h-6 text-purple-600 transition ease-in-out duration-200 transform hover:scale-90" />
          </button>
        </form>
      </div>
    </div>
  )
}

export default Chats