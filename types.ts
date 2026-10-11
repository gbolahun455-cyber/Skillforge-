import type { AccountStatus } from './status'

export type Department = 'Science' | 'Art' | 'Commercial'

export interface Profile {
  id: string
  full_name: string
  username: string
  phone: string
  email: string
  department: Department
  role: 'student' | 'owner'
  account_status: AccountStatus
  created_at: string
}

export interface PaymentSubmission {
  id: string
  user_id: string
  payment_reference: string
  payment_date: string
  receipt_path: string | null
  status: 'pending' | 'approved' | 'rejected'
  rejection_reason: string | null
  created_at: string
  reviewed_at: string | null
  // Present only in owner queries that join the profiles table.
  profiles?: {
    full_name: string
    username: string
    phone: string
    email: string
    department: Department
  } | null
}
