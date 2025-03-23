import  {useState} from 'react'
import { useDispatch } from "react-redux"
import authservice from '../../apiInterface/auth.ts'
import { logOut } from '../../store/authSlice.ts'
import "./logout.css"
import { faSignOutAlt} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


export default function LogOutBtn() {
    const dispatch = useDispatch()
    const [isLogout, setIsLogout] = useState(false)
    const logoutHandler = () => {
        let prefix
        const host = window.location.hostname
        if (host === "localhost") {
            prefix = "dev_"
        }
        else{
            prefix = "prod_"
        }
        sessionStorage.removeItem(`${prefix}authtoken`);
        sessionStorage.removeItem(`${prefix}userData`)
        authservice.logOut().then(() => {
            dispatch(logOut())
        })
    }
    const clickOk = () => {
      setIsLogout(true)
      return "Clicked on logout succesfully"
    }
    const handleClose = () => {
      setIsLogout(false) 
    }
  return (
    <div>
      <button 
      onClick={clickOk}
      className='inline-block px-6 py-2 duration-200 bg-customHeaderButtonColor hover:bg-customPurple mx-1 rounded-full text-white font-bold'>
          <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
           Log Out
      </button>
      {isLogout && (
        <div className="modal">
          <div className="modal-content">
            <p>Do you want to log out?</p>
            <button type="submit" onClick={logoutHandler}>
              Yes
            </button>
            <button type="submit" onClick={handleClose}>
              No
            </button>
          </div>
        </div>
      )}
    </div>
    
  )
}
