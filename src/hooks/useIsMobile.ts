import { useState, useEffect } from 'react'

const PHONE_BREAKPOINT = 640
const TABLET_BREAKPOINT = 768

type Device = 'phone' | 'tablet' | 'desktop'

function getDevice(width: number): Device {
  if (width < PHONE_BREAKPOINT) return 'phone'
  if (width < TABLET_BREAKPOINT) return 'tablet'
  return 'desktop'
}

export function useDevice() {
  const [device, setDevice] = useState<Device>(() => getDevice(window.innerWidth))

  useEffect(() => {
    const onResize = () => setDevice(getDevice(window.innerWidth))
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return device
}

/** 768px 미만 (폰 + 태블릿) */
export function useIsMobile() {
  return useDevice() !== 'desktop'
}

/** 640px 미만 (폰만) */
export function useIsPhone() {
  return useDevice() === 'phone'
}
