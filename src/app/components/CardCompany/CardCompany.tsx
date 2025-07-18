import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";

interface CardCompanyProps {
  name: string;
  icon?: string | null;
  executiveName: string;
  executiveLink: string;
  companySuperior?: string | null;
  handle?: string;
  active?: boolean
}

export default function CardCompany({
  name,
  executiveLink,
  executiveName,
  companySuperior,
  icon,
  handle,
  active
}: CardCompanyProps) {
  const router = useRouter();

  const handleClick = () => {
    if(!handle || !active){
      return
    }

    router.push(`/dashboard/companias/${handle}`);
  }

  return (
    <div onClick={handleClick} className={`bg-slate-800 rounded-md p-5 flex gap-4 items-center ${handle && active && "cursor-pointer"} ${!active && 'opacity-50 pointer-events-none'}`}>
      <div>
        {icon ? (
          <div className="w-20 aspect-square bg-slate-800 rounded-full flex justify-center items-center text-2xl overflow-hidden">
            <img className={`w-full h-full object-cover ${!active && "grayscale"}`} src={icon} alt="" />
          </div>
        ) : (
          <div className="w-20 aspect-square bg-slate-800 rounded-full flex justify-center items-center text-2xl">
            <FontAwesomeIcon icon={faImage} />
          </div>
        )}
        {/* <img src="" alt="" /> */}
      </div>

      <div>
        {companySuperior && (
          <span className="text-xs bg-slate-300 rounded-sm text-cp-dark p-1 py-[2px] font-bold mb-2 inline-block mr-1">
            {companySuperior}
          </span>
        )}

        {!active && (
          <span className="text-xs bg-slate-300 rounded-sm text-cp-dark p-1 py-[2px] font-bold mb-2 inline-block mr-1">
            Inactiva
          </span>
        )}
        <h3 className="font-bold text-2xl">{name}</h3>
        <p className="text-sm">
          Ejecutivo/a:{" "}
          <a
            className="underline hover:opacity-65 text-cp-primary"
            href={executiveLink}
            target="_blank"
          >
            {executiveName}
          </a>
        </p>
      </div>
    </div>
  );
}
