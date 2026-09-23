import { useMemo } from 'react'

interface LocaleInfo {
  locale: string
  currency: string
  country: string
}

const timezoneToCurrency: Record<string, { currency: string; country: string }> = {
  'Europe/Paris': { currency: 'EUR', country: 'FR' },
  'Europe/Berlin': { currency: 'EUR', country: 'DE' },
  'Europe/Madrid': { currency: 'EUR', country: 'ES' },
  'Europe/Rome': { currency: 'EUR', country: 'IT' },
  'Europe/Amsterdam': { currency: 'EUR', country: 'NL' },
  'Europe/Brussels': { currency: 'EUR', country: 'BE' },
  'Europe/Vienna': { currency: 'EUR', country: 'AT' },
  'Europe/Lisbon': { currency: 'EUR', country: 'PT' },
  'Europe/Helsinki': { currency: 'EUR', country: 'FI' },
  'Europe/Dublin': { currency: 'EUR', country: 'IE' },
  'Europe/Athens': { currency: 'EUR', country: 'GR' },
  'Europe/Luxembourg': { currency: 'EUR', country: 'LU' },
  'Europe/London': { currency: 'GBP', country: 'GB' },
  'Europe/Zurich': { currency: 'CHF', country: 'CH' },
  'Europe/Stockholm': { currency: 'SEK', country: 'SE' },
  'Europe/Oslo': { currency: 'NOK', country: 'NO' },
  'Europe/Copenhagen': { currency: 'DKK', country: 'DK' },
  'Europe/Warsaw': { currency: 'PLN', country: 'PL' },
  'Europe/Prague': { currency: 'CZK', country: 'CZ' },
  'Europe/Budapest': { currency: 'HUF', country: 'HU' },
  'Europe/Bucharest': { currency: 'RON', country: 'RO' },
  'America/New_York': { currency: 'USD', country: 'US' },
  'America/Chicago': { currency: 'USD', country: 'US' },
  'America/Denver': { currency: 'USD', country: 'US' },
  'America/Los_Angeles': { currency: 'USD', country: 'US' },
  'America/Anchorage': { currency: 'USD', country: 'US' },
  'Pacific/Honolulu': { currency: 'USD', country: 'US' },
  'America/Toronto': { currency: 'CAD', country: 'CA' },
  'America/Vancouver': { currency: 'CAD', country: 'CA' },
  'America/Montreal': { currency: 'CAD', country: 'CA' },
  'Asia/Tokyo': { currency: 'JPY', country: 'JP' },
  'Asia/Shanghai': { currency: 'CNY', country: 'CN' },
  'Asia/Kolkata': { currency: 'INR', country: 'IN' },
  'Australia/Sydney': { currency: 'AUD', country: 'AU' },
  'Australia/Melbourne': { currency: 'AUD', country: 'AU' },
  'America/Sao_Paulo': { currency: 'BRL', country: 'BR' },
  'Asia/Seoul': { currency: 'KRW', country: 'KR' },
  'Asia/Singapore': { currency: 'SGD', country: 'SG' },
  'Asia/Hong_Kong': { currency: 'HKD', country: 'HK' },
}

const localeToCurrency: Record<string, { currency: string; country: string }> = {
  fr: { currency: 'EUR', country: 'FR' },
  de: { currency: 'EUR', country: 'DE' },
  es: { currency: 'EUR', country: 'ES' },
  it: { currency: 'EUR', country: 'IT' },
  nl: { currency: 'EUR', country: 'NL' },
  pt: { currency: 'EUR', country: 'PT' },
  en: { currency: 'USD', country: 'US' },
  ja: { currency: 'JPY', country: 'JP' },
  zh: { currency: 'CNY', country: 'CN' },
  ko: { currency: 'KRW', country: 'KR' },
}

function detectLocaleInfo(): LocaleInfo {
  if (typeof window === 'undefined') {
    return { locale: 'fr-FR', currency: 'EUR', country: 'FR' }
  }

  const locale = navigator.language || 'fr-FR'

  // Try timezone first (more accurate)
  try {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    const tzInfo = timezoneToCurrency[timezone]
    if (tzInfo) {
      return { locale, ...tzInfo }
    }
  } catch {
    // Intl not available
  }

  // Fallback to language code
  const langCode = locale.split('-')[0].toLowerCase()
  const langInfo = localeToCurrency[langCode]
  if (langInfo) {
    return { locale, ...langInfo }
  }

  // Default to EUR/FR (this is a French site)
  return { locale, currency: 'EUR', country: 'FR' }
}

export function useLocaleDetection(): LocaleInfo {
  const localeInfo = useMemo(() => detectLocaleInfo(), [])
  return localeInfo
}
