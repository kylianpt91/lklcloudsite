import { useEffect } from 'react'

const BASE_TITLE = 'LKLCloud'

export default function useDocumentTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${BASE_TITLE} — ${title}` : BASE_TITLE
    return () => {
      document.title = BASE_TITLE
    }
  }, [title])
}
