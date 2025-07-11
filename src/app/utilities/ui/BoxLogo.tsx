import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faImage } from '@fortawesome/free-solid-svg-icons';

interface BoxLogoProps {
  url: string;
  type?: 'user' | 'logo';
  size?: 'small' | 'medium' | 'large';
}

export default function BoxLogo({ url, type = 'logo', size = 'medium' }: BoxLogoProps) {
  const sizeClass = {
    small: 'w-12 h-12',
    medium: 'w-16 h-16',
    large: 'w-24 h-24'
  }[size];

  return (
    <div className={`flex items-center justify-center rounded-full overflow-hidden bg-slate-600 ${sizeClass}`}>
      {url ? (
        <Image
          unoptimized
          src={url}
          alt={type === 'user' ? 'Foto de perfil' : 'Logo'}
          width={size === 'small' ? 32 : size === 'medium' ? 48 : 64}
          height={size === 'small' ? 32 : size === 'medium' ? 48 : 64}
          className="w-full h-full object-cover"
        />
      ) : type === 'user' ? (
        <FontAwesomeIcon icon={faUser} className="text-slate-400 text-2xl" />
      ) : (
        <FontAwesomeIcon icon={faImage} className="text-slate-400 text-2xl" />
      )}
    </div>
  );
}
