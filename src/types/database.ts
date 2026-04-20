export interface Profile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface Car {
  id: string
  user_id: string
  title: string
  description: string | null
  price: number
  year: number
  mileage: string | null
  make: string | null
  model: string | null
  version: string | null
  invoice: 'original' | 'refactura' | null
  motor: string | null
  owners: number | null
  images: string[] | null
  featured: boolean
  status: 'available' | 'sold' | 'reserved'
  created_at: string
  updated_at: string
  // Exterior
  exterior_color: string | null
  xenon_headlights: boolean
  aluminum_rims: boolean
  fog_lights: boolean
  front_fog_lights: boolean
  rear_fog_lights: boolean
  roof_rack: boolean
  color_matched_bumpers: boolean
  tow_bar: boolean
  rear_wiper: boolean
  // Interior
  interior_color: string | null
  folding_rear_seats: boolean
  cup_holders: boolean
  leather_upholstery: boolean
  rear_headrests: boolean
  // Equipment & Comfort
  cruise_control: boolean
  lights_reminder: boolean
  trip_computer: boolean
  sunroof: boolean
  climate_control: boolean
  rain_sensor: boolean
  rear_defroster: boolean
  air_conditioning: boolean
  power_mirrors: boolean
  headlight_control: boolean
  power_driver_seat: boolean
  light_sensor: boolean
  parking_sensor: boolean
  power_windows: boolean
  remote_trunk_release: boolean
  power_seats: boolean
  central_locking: boolean
  spare_tire: boolean
  // Safety
  abs_brakes: boolean
  alarm: boolean
  driver_airbag: boolean
  electronic_brake_assist: boolean
  engine_immobilizer: boolean
  passenger_airbag: boolean
  side_airbags: boolean
  stability_control: boolean
  steering_wheel_controls: boolean
  third_brake_light: boolean
  curtain_airbags: boolean
  armor: boolean
  // Entertainment
  gps: boolean
  am_fm_radio: boolean
  bluetooth: boolean
  cd_player: boolean
  dvd_player: boolean
  mp3_player: boolean
  sd_card: boolean
  usb_port: boolean
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: Omit<Profile, 'created_at' | 'updated_at'>
        Update: Partial<Omit<Profile, 'id' | 'created_at'>>
      }
      cars: {
        Row: Car
        Insert: Omit<Car, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Car, 'id' | 'created_at' | 'user_id'>>
      }
    }
  }
}
