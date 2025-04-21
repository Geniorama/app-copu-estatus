import Image from 'next/image';

interface BoxLogoProps {
  url: string;
}

export default function BoxLogo({ url }: BoxLogoProps) {
  return (
    <div className="w-12 h-12 flex items-center justify-center">
      {url ? (
        <Image
          unoptimized
          src={url}
          alt="Logo"
          width={48}
          height={48}
          className="w-full h-full object-contain"
        />
      ) : (
        <div className="w-full h-full bg-slate-700 rounded-sm"></div>
      )}
    </div>
  );
}
