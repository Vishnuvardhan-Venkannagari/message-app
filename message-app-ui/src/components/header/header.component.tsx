import Container from "../container/Container"
import LogOutBtn from './logout'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/store'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core'

interface NavItem {
  name: string
  endPoint: string
  icon: IconDefinition
  active: boolean
}

export default function Header() {
  const authStatus = useSelector((state: RootState) => state.auth.status)
  const navigate = useNavigate()
  const navItems: NavItem[] = [
    {
      name: "LogIn",
      endPoint: "/login",
      icon: faSignInAlt,
      active: !authStatus
    },
    {
      name: "SignUp",
      endPoint: "/signup",
      icon: faUserPlus,
      active: !authStatus
    },
  ]

  return (
    <header className='py-3 shadow bg-customGold'>
      <Container>
        <nav className='flex items-center justify-between relative'>
          <h1 className="absolute left-1/2 transform -translate-x-1/2 text-white text-2xl font-bold tracking-wide">
            Message App
          </h1>
          <ul className='flex ml-auto'>
            {navItems.map(item => item.active && (
              <li key={item.name}>
                <button
                  onClick={() => navigate(item.endPoint)}
                  className='inline-block px-6 py-2 duration-200 bg-customHeaderButtonColor hover:bg-customPurple rounded-full mx-1 text-white font-bold'
                >
                  <FontAwesomeIcon icon={item.icon} className="mr-2" />
                  {item.name}
                </button>
              </li>
            ))}
            {authStatus && (
              <li>
                <LogOutBtn />
              </li>
            )}
          </ul>
        </nav>
      </Container>
    </header>
  )
}
