import { Printer } from 'lucide-react'

const printCSS = `
@media print {
  /* Hide non-essential elements */
  header,
  footer,
  nav,
  .no-print,
  [data-no-print],
  button:not(.print-button),
  .fixed,
  .sticky,
  .animate-float,
  .backdrop-blur-xl,
  .glass,
  .glass-strong {
    display: none !important;
  }

  /* Reset layout */
  body {
    font-size: 12pt;
    line-height: 1.5;
    color: #000 !important;
    background: #fff !important;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  /* Full width content */
  main,
  section,
  article,
  .max-w-7xl,
  .max-w-4xl,
  .max-w-3xl,
  .max-w-2xl {
    max-width: 100% !important;
    width: 100% !important;
    padding-left: 0 !important;
    padding-right: 0 !important;
    margin-left: 0 !important;
    margin-right: 0 !important;
  }

  /* Typography */
  h1, h2, h3, h4, h5, h6 {
    color: #000 !important;
    page-break-after: avoid;
  }

  p, li {
    color: #333 !important;
  }

  /* Links */
  a {
    color: #000 !important;
    text-decoration: underline !important;
  }

  a[href^="http"]::after {
    content: " (" attr(href) ")";
    font-size: 0.8em;
    color: #666;
  }

  /* Images */
  img {
    max-width: 100% !important;
    page-break-inside: avoid;
  }

  /* Remove backgrounds and shadows */
  * {
    background: transparent !important;
    box-shadow: none !important;
    text-shadow: none !important;
  }

  /* Margins */
  @page {
    margin: 2cm;
  }

  /* Avoid page breaks inside */
  .glass,
  .card,
  blockquote,
  table {
    page-break-inside: avoid;
  }

  /* Disable all animations */
  *, *::before, *::after {
    animation: none !important;
    transition: none !important;
  }
}
`

/**
 * Injects print-optimized CSS rules into the document.
 * Render this component once at the app level.
 */
export function PrintStyles() {
  return <style>{printCSS}</style>
}

/**
 * Simple print button that triggers window.print().
 */
interface PrintButtonProps {
  className?: string
  label?: string
}

export function PrintButton({
  className = '',
  label = 'Imprimer',
}: PrintButtonProps) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className={`print-button no-print inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-neutral-dark/70 hover:text-neutral-dark border border-neutral-dark/15 rounded-full transition-colors duration-200 hover:bg-black/5 ${className}`}
      aria-label={label}
    >
      <Printer className="w-4 h-4" />
      {label}
    </button>
  )
}
