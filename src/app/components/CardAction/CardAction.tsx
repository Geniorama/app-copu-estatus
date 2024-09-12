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
    <div className="w-full cursor-pointer bg-cp-primary p-8 rounded-full hover:outline-3 hover:outline hover:outline-offset-1 outline-cp-primary text-center hover:bg-cp-dark hover:text-cp-primary transition">
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
