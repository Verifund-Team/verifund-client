import { clsx, type ClassValue } from 'clsx'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatIDRX(amount?: number) {
  if (!amount) return ''
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
    .format(amount)
    .replace('IDR', 'IDRX')
}

export function formatAddress(address?: string) {
  if (!address) return ''
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text)
}

export function formatDate(date?: string) {
  if (!date) return ''
  return format(new Date(date), 'd MMMM yyyy HH:mm', { locale: id })
}
