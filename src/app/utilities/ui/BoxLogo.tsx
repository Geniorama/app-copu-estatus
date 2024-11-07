import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faImage } from "@fortawesome/free-solid-svg-icons";
interface BoxLogoProps {
  url: string;
  type?: "logo" | "user";
  alt?: string
}

export default function BoxLogo({ url, type = "logo", alt }: BoxLogoProps) {
  return (
    <div className="w-11 aspect-square rounded-full overflow-hidden bg-slate-200">
      {url ? (
        <img
          src={url}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          alt={alt}
        />
      ) : type === "logo" ? (
        <div className=" flex w-full h-full justify-center items-center text-xl text-slate-400">
          <FontAwesomeIcon icon={faImage} />
        </div>
      ) : (
        type === "user" && (
          <div className=" flex w-full h-full justify-center items-center text-xl text-slate-400">
            <FontAwesomeIcon icon={faUser} />
          </div>
        )
      )}
    </div>
  );
}
