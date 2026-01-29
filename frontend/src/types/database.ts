// Database types generated from Supabase schema
export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export type UserRole = 'passenger' | 'conductor' | 'admin'
export type BusType = 'ordinary' | 'express' | 'deluxe'
export type TripStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
export type PaymentStatus = 'pending' | 'completed' | 'refunded'
export type TicketStatus = 'booked' | 'boarded' | 'completed' | 'cancelled' | 'expired'
export type VerificationMethod = 'qr_scan' | 'manual_entry'

export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string
                    email: string
                    full_name: string
                    phone: string | null
                    role: UserRole
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id: string
                    email: string
                    full_name: string
                    phone?: string | null
                    role?: UserRole
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    email?: string
                    full_name?: string
                    phone?: string | null
                    role?: UserRole
                    updated_at?: string
                }
            }
            depots: {
                Row: {
                    id: string
                    name: string
                    code: string
                    address: string
                    latitude: number
                    longitude: number
                    city: string
                    state: string
                    active: boolean
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    code: string
                    address: string
                    latitude: number
                    longitude: number
                    city: string
                    state: string
                    active?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    name?: string
                    code?: string
                    address?: string
                    latitude?: number
                    longitude?: number
                    city?: string
                    state?: string
                    active?: boolean
                    updated_at?: string
                }
            }
            buses: {
                Row: {
                    id: string
                    bus_number: string
                    registration_number: string
                    capacity: number
                    bus_type: BusType
                    depot_id: string
                    active: boolean
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    bus_number: string
                    registration_number: string
                    capacity: number
                    bus_type?: BusType
                    depot_id: string
                    active?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    bus_number?: string
                    registration_number?: string
                    capacity?: number
                    bus_type?: BusType
                    depot_id?: string
                    active?: boolean
                    updated_at?: string
                }
            }
            routes: {
                Row: {
                    id: string
                    route_number: string
                    name: string
                    origin_depot_id: string
                    destination_depot_id: string
                    distance_km: number
                    estimated_duration_minutes: number
                    active: boolean
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    route_number: string
                    name: string
                    origin_depot_id: string
                    destination_depot_id: string
                    distance_km: number
                    estimated_duration_minutes: number
                    active?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    route_number?: string
                    name?: string
                    origin_depot_id?: string
                    destination_depot_id?: string
                    distance_km?: number
                    estimated_duration_minutes?: number
                    active?: boolean
                    updated_at?: string
                }
            }
            route_stops: {
                Row: {
                    id: string
                    route_id: string
                    stop_name: string
                    stop_order: number
                    latitude: number
                    longitude: number
                    estimated_arrival_offset_minutes: number
                    created_at: string
                }
                Insert: {
                    id?: string
                    route_id: string
                    stop_name: string
                    stop_order: number
                    latitude: number
                    longitude: number
                    estimated_arrival_offset_minutes?: number
                    created_at?: string
                }
                Update: {
                    stop_name?: string
                    stop_order?: number
                    latitude?: number
                    longitude?: number
                    estimated_arrival_offset_minutes?: number
                }
            }
            trips: {
                Row: {
                    id: string
                    trip_number: string
                    route_id: string
                    bus_id: string
                    conductor_id: string | null
                    scheduled_departure: string
                    scheduled_arrival: string
                    actual_departure: string | null
                    actual_arrival: string | null
                    status: TripStatus
                    available_seats: number
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    trip_number: string
                    route_id: string
                    bus_id: string
                    conductor_id?: string | null
                    scheduled_departure: string
                    scheduled_arrival: string
                    actual_departure?: string | null
                    actual_arrival?: string | null
                    status?: TripStatus
                    available_seats: number
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    trip_number?: string
                    route_id?: string
                    bus_id?: string
                    conductor_id?: string | null
                    scheduled_departure?: string
                    scheduled_arrival?: string
                    actual_departure?: string | null
                    actual_arrival?: string | null
                    status?: TripStatus
                    available_seats?: number
                    updated_at?: string
                }
            }
            tickets: {
                Row: {
                    id: string
                    ticket_number: string
                    trip_id: string
                    passenger_id: string
                    boarding_stop_id: string
                    drop_stop_id: string
                    seat_number: number | null
                    fare_amount: number
                    booking_time: string
                    payment_status: PaymentStatus
                    payment_id: string | null
                    qr_code: string
                    status: TicketStatus
                    boarded_at: string | null
                    boarded_by: string | null
                    valid_from: string
                    valid_until: string
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    ticket_number: string
                    trip_id: string
                    passenger_id: string
                    boarding_stop_id: string
                    drop_stop_id: string
                    seat_number?: number | null
                    fare_amount: number
                    booking_time?: string
                    payment_status?: PaymentStatus
                    payment_id?: string | null
                    qr_code: string
                    status?: TicketStatus
                    boarded_at?: string | null
                    boarded_by?: string | null
                    valid_from: string
                    valid_until: string
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    ticket_number?: string
                    trip_id?: string
                    passenger_id?: string
                    boarding_stop_id?: string
                    drop_stop_id?: string
                    seat_number?: number | null
                    fare_amount?: number
                    payment_status?: PaymentStatus
                    payment_id?: string | null
                    qr_code?: string
                    status?: TicketStatus
                    boarded_at?: string | null
                    boarded_by?: string | null
                    valid_from?: string
                    valid_until?: string
                    updated_at?: string
                }
            }
            bus_locations: {
                Row: {
                    id: string
                    trip_id: string
                    latitude: number
                    longitude: number
                    speed: number | null
                    heading: number | null
                    recorded_at: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    trip_id: string
                    latitude: number
                    longitude: number
                    speed?: number | null
                    heading?: number | null
                    recorded_at?: string
                    created_at?: string
                }
                Update: {
                    latitude?: number
                    longitude?: number
                    speed?: number | null
                    heading?: number | null
                    recorded_at?: string
                }
            }
            stop_arrivals: {
                Row: {
                    id: string
                    trip_id: string
                    route_stop_id: string
                    estimated_arrival: string
                    actual_arrival: string | null
                    delay_minutes: number | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    trip_id: string
                    route_stop_id: string
                    estimated_arrival: string
                    actual_arrival?: string | null
                    delay_minutes?: number | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    estimated_arrival?: string
                    actual_arrival?: string | null
                    delay_minutes?: number | null
                    updated_at?: string
                }
            }
            boarding_logs: {
                Row: {
                    id: string
                    ticket_id: string
                    trip_id: string
                    conductor_id: string
                    boarding_time: string
                    boarding_stop_id: string
                    verification_method: VerificationMethod
                    created_at: string
                }
                Insert: {
                    id?: string
                    ticket_id: string
                    trip_id: string
                    conductor_id: string
                    boarding_time?: string
                    boarding_stop_id: string
                    verification_method?: VerificationMethod
                    created_at?: string
                }
                Update: {
                    boarding_time?: string
                    verification_method?: VerificationMethod
                }
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            user_role: UserRole
            bus_type: BusType
            trip_status: TripStatus
            payment_status: PaymentStatus
            ticket_status: TicketStatus
            verification_method: VerificationMethod
        }
    }
}
