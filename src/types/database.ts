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
  image_url: string | null
  featured: boolean
  status: 'available' | 'sold' | 'reserved'
  created_at: string
  updated_at: string
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
