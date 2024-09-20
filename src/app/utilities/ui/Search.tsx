
import { ChangeEvent } from "react"

interface SearchProps {
  placeholder?: string
  value?: string
  onChange?: (e:ChangeEvent<HTMLInputElement>) => void
}

export default function Search({onChange, placeholder, value}:SearchProps) {
  return (
    /* From Uiverse.io by ahmedyasserdev */
    <form className="form relative w-full">
      <button type='submit' className="absolute left-2 -translate-y-1/2 top-1/2 p-1">
        {/* <button type='submit' className=""> */}
        <svg
          width="17"
          height="16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-labelledby="search"
          className="w-5 h-5 text-cp-primary"
        >
          <path
            d="M7.667 12.667A5.333 5.333 0 107.667 2a5.333 5.333 0 000 10.667zM14.334 14l-2.9-2.9"
            stroke="currentColor"
            stroke-width="1.333"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></path>
        </svg>
      </button>
      <input
        onChange={onChange ? (e)=>onChange(e) : () => console.log('change event')}
        className="block bg-transparent w-full rounded-md outline-none border-2 border-slate-300 text-cp-light py-3 px-10 placeholder:text-gray-400 focus-visible:border-cp-primary"
        placeholder={placeholder || 'Buscar...'}
        type="text"
        value={value}
      />
      <button type="reset" className="absolute right-2 -translate-y-1/2 top-1/2 p-1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5 text-cp-primary"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M6 18L18 6M6 6l12 12"
          ></path>
        </svg>
      </button>
    </form>

  )
}
