import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faBuilding,
  faPhotoFilm,
  faCube
} from "@fortawesome/free-solid-svg-icons";

interface CardActionProps {
  title: string;
  icon?: string;
  handle?: () => void;
}

const actionIcons = [
  {
    name: "user",
    icon: faUser,
  },

  {
    name: "company",
    icon: faBuilding,
  },

  {
    name: "service",
    icon: faCube,
  },

  {
    name: "content",
    icon: faPhotoFilm,
  },
];

export default function CardAction({ title, icon }: CardActionProps) {
  return (
    <div className="w-full cursor-pointer text-cp-primary bg-slate-800 p-8 rounded-lg hover:outline-3 hover:outline hover:outline-offset-1 text-center hover:bg-cp-primary hover:text-cp-dark transition">
      {icon && (
        <span className="text-4xl mb-4 inline-flex justify-center items-center ">
          <FontAwesomeIcon
            icon={actionIcons.find((item) => item.name === icon)?.icon || faUser}
          />
        </span>
      )}
      <h2 className="text-2xl font-bold">{title}</h2>
    </div>
  );
}
