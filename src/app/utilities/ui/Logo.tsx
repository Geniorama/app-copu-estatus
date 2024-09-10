import Image from 'next/image'
import logo from '@/app/img/Logo.svg'

export default function Logo() {
  return (
    <Image
      src={logo}
      alt='COPU Logo'
      width={150}
      height={50}
    />
  )
}
