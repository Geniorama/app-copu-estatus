import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faImage } from '@fortawesome/free-solid-svg-icons';

interface BoxLogoProps {
  url: string;
  type?: 'user' | 'logo';
}

export default function BoxLogo({ url, type = 'logo' }: BoxLogoProps) {
  return (
    <div className="w-12 h-12 flex items-center justify-center rounded-full overflow-hidden bg-slate-600">
      {url ? (
        <Image
          unoptimized
          src={url}
          alt={type === 'user' ? 'Foto de perfil' : 'Logo'}
          width={48}
          height={48}
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
