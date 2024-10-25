import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

interface ProfileProps {
  onClick?: () => void;
  image?: string
}

export function Profile({ onClick, image }: ProfileProps) {
  return (
    <div onClick={onClick} className='w-10 h-10 bg-slate-800 rounded-full flex justify-center items-center cursor-pointer'>
      {
        image ?
          <img className="w-full aspect-square inline-block rounded-full" src={image} alt='Profile' /> :
          <FontAwesomeIcon className="text-cp-primary size-6" icon={faUser} />
      }
    </div>
  )
}

export default Profile;