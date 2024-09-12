import Image from 'next/image'
import LogoPrimaryDark from '@/app/img/logo-primary-dark.svg'
import LogoPrimaryLight from '@/app/img/logo-primary-light.svg'
import LogoLight from '@/app/img/logo-light.svg'

interface LogoProps {
  mode?: 'cp-primary-dark' | 'cp-primary-light' | 'cp-light';
}

export default function Logo(logoType: LogoProps) {
  const logo = !logoType.mode || logoType.mode === 'cp-primary-dark' ?
    LogoPrimaryDark :
    logoType.mode === 'cp-primary-light' ?
      LogoPrimaryLight :
      logoType.mode === 'cp-light' ?
        LogoLight : '';

  return (
    <Image
      src={logo}
      alt='COPU Logo'
      width={150}
      height={50}
    />
  )
}
