'use client'
import React from 'react'
import { Monitor, Tablet, Smartphone } from 'lucide-react'

type DeviceType = 'desktop' | 'tablet' | 'mobile'

interface ResponsiveControlsProps {
  currentDevice: DeviceType
  onDeviceChange: (device: DeviceType) => void
}

const ResponsiveControls: React.FC<ResponsiveControlsProps> = ({
  currentDevice,
  onDeviceChange
}) => {
  const devices = [
    {
      type: 'desktop' as DeviceType,
      icon: Monitor,
      label: 'Desktop',
      width: '1024px',
      class: 'w-full'
    },
    {
      type: 'tablet' as DeviceType,
      icon: Tablet,
      label: 'Tablet',
      width: '768px',
      class: 'max-w-[768px]'
    },
    {
      type: 'mobile' as DeviceType,
      icon: Smartphone,
      label: 'Mobile',
      width: '375px',
      class: 'max-w-[375px]'
    }
  ]

  return (
    <div className="flex items-center gap-2 p-4 bg-white border-b border-slate-200">
      <span className="text-sm font-medium text-slate-600">Viewport:</span>
      
      <div className="flex gap-1 bg-slate-100 rounded-lg p-1">
        {devices.map((device) => {
          const Icon = device.icon
          const isActive = currentDevice === device.type
          
          return (
            <button
              key={device.type}
              onClick={() => onDeviceChange(device.type)}
              className={`
                flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all
                ${isActive 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
                }
              `}
              title={`${device.label} (${device.width})`}
            >
              <Icon size={18} />
              <span className="hidden sm:block">{device.label}</span>
            </button>
          )
        })}
      </div>
      
      {/* عرض المقاس الحالي */}
      <div className="ml-auto text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">
        {devices.find(d => d.type === currentDevice)?.width}
      </div>
    </div>
  )
}

export default ResponsiveControls;