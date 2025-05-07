import { useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../../services/operations/authApi'
import { VscSignOut } from 'react-icons/vsc'

const Sidebar = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const location = useLocation()
  const { currentEvent } = useSelector((state) => state.event || { currentEvent: 'Main Conference 2025' })

  const handleLogout = () => {
    dispatch(logout())
  }

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: 'https://cdn.builder.io/api/v1/image/assets/8b127f84600e4697b97452edc00f01d8/db557c361fdb155ecca43581c73325ff9466e8a0?apiKey=8b127f84600e4697b97452edc00f01d8&' },
    { name: 'Attendees', path: '/attendees', icon: 'https://cdn.builder.io/api/v1/image/assets/8b127f84600e4697b97452edc00f01d8/42ad60deee88784ab08318d970b26230eae310e3?apiKey=8b127f84600e4697b97452edc00f01d8&' },
    { name: 'Form Builder', path: '/form-builder', icon: 'https://cdn.builder.io/api/v1/image/assets/8b127f84600e4697b97452edc00f01d8/4ecdd87eb622daa954e863868498b751c1df51fc?apiKey=8b127f84600e4697b97452edc00f01d8&' },
    { name: 'Check-in', path: '/check-in', icon: 'https://cdn.builder.io/api/v1/image/assets/8b127f84600e4697b97452edc00f01d8/c930ac8f02fd58e0c75da6a52d83a9ba917af9eb?apiKey=8b127f84600e4697b97452edc00f01d8&' },
    { name: 'Events', path: '/events', icon: 'https://cdn.builder.io/api/v1/image/assets/8b127f84600e4697b97452edc00f01d8/cead2021c17df8c3c238e27390ab077cd62071ad?apiKey=8b127f84600e4697b97452edc00f01d8&' },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <div className="flex overflow-hidden flex-col max-w-[239px] h-screen bg-white shadow-sm">
      <div className="flex z-10 flex-col items-start pr-4 pl-2 w-full text-xs font-medium leading-none pt-4">
        <div className="text-slate-500">Current Event</div>
        <div className="flex gap-4 justify-between items-center px-3.5 py-2.5 mt-5 text-sm leading-none text-center bg-white rounded-md border border-solid border-slate-200 min-h-[40px] text-zinc-700 w-full">
          <div className="overflow-hidden self-stretch my-auto truncate">
            {currentEvent}
          </div>
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/8b127f84600e4697b97452edc00f01d8/0936b8c9990b449d567a71bc063b383a51a6c752?apiKey=8b127f84600e4697b97452edc00f01d8&"
            className="object-contain shrink-0 self-stretch my-auto w-4 aspect-square"
            alt="Dropdown arrow"
          />
        </div>
        <div className="mt-9 text-zinc-700">Management</div>
      </div>
      <div className="flex flex-col mt-2.5 w-full text-sm leading-none text-zinc-700">
        {navItems.map((item) => (
          <div key={item.name} className="flex flex-col mt-1 w-full font-medium whitespace-nowrap">
            <div 
              className={`flex overflow-hidden gap-4 items-center px-2 py-1.5 w-full rounded-md min-h-[32px] cursor-pointer transition-colors ${
                isActive(item.path) ? 'bg-zinc-100 text-zinc-900' : 'hover:bg-zinc-50'
              }`}
              onClick={() => navigate(item.path)}
            >
              <img
                loading="lazy"
                src={item.icon}
                className="object-contain shrink-0 self-stretch my-auto w-4 aspect-square"
                alt={`${item.name} icon`}
              />
              <div className="overflow-hidden self-stretch my-auto">
                {item.name}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-auto mb-6 px-2">
        <button 
          onClick={handleLogout}
          className="flex w-full items-center gap-2 px-2 py-2 text-sm text-red-600 rounded-md hover:bg-red-50"
        >
          <VscSignOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  )
}

export default Sidebar
