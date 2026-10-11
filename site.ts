// Public business details shown to students on the payment page.
// The account number is not a secret, but it is visible to anyone who loads the site.
export const PAYMENT = {
  method: 'OPay',
  accountNumber: '8114095631',
  accountName: 'Ogunlowo Sodiq',
  amountNgn: 500,
} as const

export const REGISTRATION_FEE_NGN = 500

export const DEPARTMENTS = ['Science', 'Art', 'Commercial'] as const
