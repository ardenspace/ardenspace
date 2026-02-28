import StarfieldBg from './StarfieldBg'
import MenuBar from './MenuBar'
import Dock from './Dock'
import WindowManager from './WindowManager'

export default function DesktopScreen() {
  return (
    <div className="w-full h-full relative text-white overflow-hidden">
      <StarfieldBg />
      <MenuBar />
      <WindowManager />
      <Dock />
    </div>
  )
}
