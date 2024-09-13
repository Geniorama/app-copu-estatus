import LogoPrimaryDark from '@/app/img/logo-primary-dark.svg'
import LogoPrimaryLight from '@/app/img/logo-primary-light.svg'
import LogoLight from '@/app/img/logo-light.svg'

interface LogoProps {
  mode?: 'cp-primary-dark' | 'cp-primary-light' | 'cp-light';
}

export default function Logo({ mode }: LogoProps) {
  const logo = !mode || mode === 'cp-primary-dark' ?
    LogoPrimaryDark :
    mode === 'cp-primary-light' ?
      LogoPrimaryLight :
      mode === 'cp-light' ?
        LogoLight : '';

  return (
    <img className='w-full' src={logo.src} alt="Logo" />
  )
}
