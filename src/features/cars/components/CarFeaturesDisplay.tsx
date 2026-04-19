import type { Car } from '@/types/database'

interface FeatureSection {
  title: string
  colorDot: string
  colorText: string
  colorBg: string
  colorBorder: string
  items: { label: string; value: boolean | string | null }[]
}

export function CarFeaturesDisplay({ car }: { car: Car }) {
  const sections: FeatureSection[] = [
    {
      title: 'Exterior',
      colorDot: 'bg-emerald-400',
      colorText: 'text-emerald-400',
      colorBg: 'bg-emerald-500/5',
      colorBorder: 'border-emerald-500/20',
      items: [
        { label: 'Color Exterior', value: car.exterior_color || null },
        { label: 'Faros de xenón', value: car.xenon_headlights },
        { label: 'Rines de aluminio', value: car.aluminum_rims },
        { label: 'Luces de niebla', value: car.fog_lights },
        { label: 'Luces de niebla frontales', value: car.front_fog_lights },
        { label: 'Luces de niebla traseras', value: car.rear_fog_lights },
        { label: 'Barra porta equipaje', value: car.roof_rack },
        { label: 'Defensas a color', value: car.color_matched_bumpers },
        { label: 'Barra remolcadora', value: car.tow_bar },
        { label: 'Limpiaparabrisas trasero', value: car.rear_wiper },
      ],
    },
    {
      title: 'Interior',
      colorDot: 'bg-violet-400',
      colorText: 'text-violet-400',
      colorBg: 'bg-violet-500/5',
      colorBorder: 'border-violet-500/20',
      items: [
        { label: 'Color Interior', value: car.interior_color || null },
        { label: 'Asientos traseros abatibles', value: car.folding_rear_seats },
        { label: 'Portavasos', value: car.cup_holders },
        { label: 'Tapicería de piel', value: car.leather_upholstery },
        { label: 'Cabeceras asientos traseros', value: car.rear_headrests },
      ],
    },
    {
      title: 'Equipamiento y Confort',
      colorDot: 'bg-amber-400',
      colorText: 'text-amber-400',
      colorBg: 'bg-amber-500/5',
      colorBorder: 'border-amber-500/20',
      items: [
        { label: 'Piloto automático', value: car.cruise_control },
        { label: 'Recordatorio de luces encendidas', value: car.lights_reminder },
        { label: 'Computadora de viaje', value: car.trip_computer },
        { label: 'Techo corredizo', value: car.sunroof },
        { label: 'Control de clima', value: car.climate_control },
        { label: 'Sensor de lluvia', value: car.rain_sensor },
        { label: 'Desempañador trasero', value: car.rear_defroster },
        { label: 'Aire acondicionado', value: car.air_conditioning },
        { label: 'Espejos eléctricos', value: car.power_mirrors },
        { label: 'Control de faros', value: car.headlight_control },
        { label: 'Asiento piloto ajustes eléctricos', value: car.power_driver_seat },
        { label: 'Sensor de luces', value: car.light_sensor },
        { label: 'Sensor de estacionamiento', value: car.parking_sensor },
        { label: 'Cristales eléctricos', value: car.power_windows },
        { label: 'Apertura remota de cajuela', value: car.remote_trunk_release },
        { label: 'Asientos ajustes eléctricos', value: car.power_seats },
        { label: 'Cerradura centralizada', value: car.central_locking },
        { label: 'Llanta de refacción', value: car.spare_tire },
      ],
    },
    {
      title: 'Seguridad',
      colorDot: 'bg-red-400',
      colorText: 'text-red-400',
      colorBg: 'bg-red-500/5',
      colorBorder: 'border-red-500/20',
      items: [
        { label: 'Frenos ABS', value: car.abs_brakes },
        { label: 'Alarma', value: car.alarm },
        { label: 'Bolsas de aire conductor', value: car.driver_airbag },
        { label: 'Asistente de frenado electrónico', value: car.electronic_brake_assist },
        { label: 'Inmovilizador de motor', value: car.engine_immobilizer },
        { label: 'Bolsas de aire pasajero', value: car.passenger_airbag },
        { label: 'Bolsas de aire laterales', value: car.side_airbags },
        { label: 'Control de estabilidad', value: car.stability_control },
        { label: 'Controles en volante', value: car.steering_wheel_controls },
        { label: 'Tercer luz trasera', value: car.third_brake_light },
        { label: 'Bolsas de aire de cortina', value: car.curtain_airbags },
        { label: 'Blindaje', value: car.armor },
      ],
    },
    {
      title: 'Entretenimiento',
      colorDot: 'bg-sky-400',
      colorText: 'text-sky-400',
      colorBg: 'bg-sky-500/5',
      colorBorder: 'border-sky-500/20',
      items: [
        { label: 'GPS', value: car.gps },
        { label: 'Radio AM/FM', value: car.am_fm_radio },
        { label: 'Bluetooth', value: car.bluetooth },
        { label: 'CD player', value: car.cd_player },
        { label: 'DVD', value: car.dvd_player },
        { label: 'MP3', value: car.mp3_player },
        { label: 'SD card', value: car.sd_card },
        { label: 'USB', value: car.usb_port },
      ],
    },
  ]

  const hasAnyFeature = sections.some(s =>
    s.items.some(i => {
      if (typeof i.value === 'string') return i.value.length > 0
      return i.value === true
    })
  )

  if (!hasAnyFeature) return null

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Características del Vehículo</h3>
      <div className="grid gap-4 md:grid-cols-2">
        {sections.map(section => {
          const activeItems = section.items.filter(i => {
            if (typeof i.value === 'string') return i.value.length > 0
            return i.value === true
          })

          if (activeItems.length === 0) return null

          return (
            <div
              key={section.title}
              className={`rounded-lg border ${section.colorBorder} ${section.colorBg} p-4`}
            >
              <h4 className={`flex items-center gap-2 text-sm font-semibold ${section.colorText} mb-3`}>
                <span className={`h-2 w-2 rounded-full ${section.colorDot}`} />
                {section.title}
              </h4>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                {section.items.map(item => {
                  const isText = typeof item.value === 'string'
                  const isActive = isText ? (item.value as string).length > 0 : item.value === true

                  if (!isActive) return null

                  return (
                    <div key={item.label} className="flex items-center gap-2 text-sm">
                      <span className={isActive ? 'text-cyan-400' : 'text-gray-600'}>
                        {isText ? '' : ''}
                      </span>
                      {isText ? (
                        <span className="text-gray-300">
                          <span className="text-gray-500">{item.label}:</span>{' '}
                          <span className="font-medium text-white">{item.value as string}</span>
                        </span>
                      ) : (
                        <span className="text-gray-300">{item.label}</span>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
