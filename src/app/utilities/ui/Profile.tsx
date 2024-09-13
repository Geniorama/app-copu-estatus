import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

interface ProfileProps {
  URL?: string;
}

export function Profile({ URL }: ProfileProps) {
  return (
    <div className='w-10 h-10 bg-slate-800 rounded-full flex justify-center items-center'>
      {
        URL ?
          <img className="w-full aspect-square inline-block rounded-full" src={URL} alt='Profile' /> :
          <FontAwesomeIcon className="text-cp-primary size-6" icon={faUser} />
      }
    </div>
  )
}

export default Profile;