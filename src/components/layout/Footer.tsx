import { Link } from 'react-router-dom'
import { Instagram, MessageCircle, Linkedin } from 'lucide-react'
import Logo from './Logo'
import { useBridgeProductGroups, useBridgeSettings } from '@/hooks/useBridge'

const legalLinks = [
  { label: 'Mentions Légales', href: '/mentions-legales' },
  { label: 'CGV', href: '/cgv' },
  { label: 'CGU', href: '/cgu' },
  { label: 'Politique de confidentialité', href: '/politique-confidentialite' },
  { label: 'Contact', href: '/contact' },
]

export default function Footer() {
  const productGroups = useBridgeProductGroups()
  const settings = useBridgeSettings()

  // Groups come from the "Navigation" admin page and the gammes assigned
  // to them — same source of truth as the header and "Nos solutions".
  const groups = productGroups.map((g) => ({
    label: g.label,
    items: g.items.map((i) => ({ label: i.label, href: i.href })),
  }))

  const socialLinks = [
    { icon: Instagram, href: settings.socialInstagram, label: 'Instagram' },
    { icon: MessageCircle, href: settings.socialDiscord, label: 'Discord' },
    { icon: Linkedin, href: settings.socialLinkedin, label: 'LinkedIn' },
  ]
  return (
    <footer className="bg-surface text-text border-t border-hairline">
      <div className="mx-auto max-w-6xl px-6 pt-16 pb-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-8">
          {/* Brand */}
          <div className="space-y-4 col-span-2 sm:col-span-3 lg:col-span-1">
            <div className="flex items-center gap-2">
              <Logo size="sm" variant="footer" />
              <h3 className="eyebrow text-text-faint">LKL Cloud</h3>
            </div>
            {settings.companyTagline && (
              <p className="text-sm text-text-dim leading-relaxed max-w-xs">{settings.companyTagline}</p>
            )}
            <div className="text-sm text-text-dim leading-relaxed space-y-1">
              <p>Édité par l&apos;association LKL CLOUD</p>
              <p><span className="font-semibold">SIREN</span> 999 237 175</p>
              <p><span className="font-semibold">SIRET</span> 999 237 175 00016</p>
              <p>15 Route de Gif, 91190 Villiers-le-Bâcle, France</p>
              <a href="mailto:support@lklcloud.fr" className="block hover:text-primary transition-colors">support@lklcloud.fr</a>
            </div>
            <div className="flex gap-3">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-[var(--color-tint-2)] flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                  aria-label={label}
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {groups.map((group) => (
            <div key={group.label}>
              <h3 className="eyebrow text-text-faint mb-4">{group.label}</h3>
              <ul className="space-y-2.5">
                {group.items.map((item) => (
                  <li key={item.href + item.label}>
                    {item.href.startsWith('http') ? (
                      <a href={item.href} target="_blank" rel="noopener noreferrer" className="text-sm text-text-dim hover:text-primary transition-colors">
                        {item.label}
                      </a>
                    ) : (
                      <Link to={item.href} className="text-sm text-text-dim hover:text-primary transition-colors">
                        {item.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Legal */}
          <div>
            <h3 className="eyebrow text-text-faint mb-4">Légal &amp; Support</h3>
            <ul className="space-y-2.5">
              {legalLinks.map(({ label, href }) => (
                <li key={href}>
                  <Link to={href} className="text-sm text-text-dim hover:text-primary transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-hairline space-y-3">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
            <p className="text-xs text-text-faint">
              &copy; {new Date().getFullYear()} LKL Cloud. Tous droits réservés.
            </p>
            <p className="text-xs text-text-faint">
              Hébergeur français 🇫🇷
            </p>
          </div>
          <p className="text-center sm:text-left text-[11px] text-text-faint">
            Les marques et logos affichés sont la propriété de leurs détenteurs respectifs.
          </p>
        </div>
      </div>
    </footer>
  )
}
