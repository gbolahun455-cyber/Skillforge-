export type AccountStatus =
  | 'pending_payment'
  | 'payment_under_review'
  | 'payment_approved'
  | 'entrance_pending'
  | 'active'
  | 'suspended'

export const STATUS_LABELS: Record<AccountStatus, string> = {
  pending_payment: 'Pending payment',
  payment_under_review: 'Payment under review',
  payment_approved: 'Payment approved',
  entrance_pending: 'Entrance examination pending',
  active: 'Active',
  suspended: 'Suspended',
}

// Where a student should be sent based on their account status.
export function pathForStatus(status: AccountStatus): string {
  switch (status) {
    case 'pending_payment':
    case 'payment_under_review':
      return '/payment'
    case 'payment_approved':
    case 'entrance_pending':
      return '/entrance'
    case 'active':
      return '/dashboard'
    case 'suspended':
      return '/suspended'
  }
}
