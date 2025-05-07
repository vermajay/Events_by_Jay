import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const ScrollToTop = (props) => {
  const location = useLocation()

  useEffect(() => {
    // Scroll instantly to the top of the page when the route changes
    window.scrollTo(0, 0)
  }, [location])

  return <>{props.children}</>
}

export default ScrollToTop
