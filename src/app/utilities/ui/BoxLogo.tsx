import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

interface BoxLogoProps {
  url: string;
}

export default function BoxLogo({ url }: BoxLogoProps) {
  return (
    <div className="w-12 h-12 flex items-center justify-center rounded-full overflow-hidden bg-slate-600">
      {url ? (
        <Image
          unoptimized
          src={url}
          alt="Foto de perfil"
          width={48}
          height={48}
          className="w-full h-full object-cover"
        />
      ) : (
        <FontAwesomeIcon icon={faUser} className="text-slate-400 text-2xl" />
      )}
    </div>
  );
}
