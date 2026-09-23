import { useState, useRef, useEffect } from 'react'
import type { InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes, ReactNode, KeyboardEvent } from 'react'
import { X } from 'lucide-react'

// ── Label wrapper ────────────────────────────────────────────────────

interface LabelWrapperProps {
  label: string
  required?: boolean
  error?: string
  children: ReactNode
}

function LabelWrapper({ label, required, error, children }: LabelWrapperProps) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-semibold text-[var(--admin-text-secondary)]">
        {label}
        {required && <span className="text-[var(--admin-primary)] ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-[var(--admin-danger)] font-medium">{error}</p>}
    </div>
  )
}

const inputBase = 'w-full rounded-xl border border-[var(--admin-input-border)] bg-[var(--admin-input-bg)] px-4 py-2.5 text-sm text-[var(--admin-text-primary)] placeholder-[var(--admin-text-muted)] outline-none transition-all duration-300 focus:border-[var(--admin-primary)]/50 focus:ring-1 focus:ring-[var(--admin-input-focus)] focus:bg-[var(--admin-surface-hover)]'

// ── AdminInput ───────────────────────────────────────────────────────

interface AdminInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

export function AdminInput({ label, error, required, className, ...props }: AdminInputProps) {
  return (
    <LabelWrapper label={label} required={required} error={error}>
      <input className={`${inputBase} ${className ?? ''}`} required={required} {...props} />
    </LabelWrapper>
  )
}

// ── AdminTextarea ────────────────────────────────────────────────────

interface AdminTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  error?: string
}

export function AdminTextarea({ label, error, required, className, ...props }: AdminTextareaProps) {
  return (
    <LabelWrapper label={label} required={required} error={error}>
      <textarea className={`${inputBase} min-h-[80px] resize-y ${className ?? ''}`} required={required} {...props} />
    </LabelWrapper>
  )
}

// ── AdminSelect ──────────────────────────────────────────────────────

interface AdminSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  error?: string
  options: { value: string; label: string }[]
}

export function AdminSelect({ label, error, required, options, className, ...props }: AdminSelectProps) {
  return (
    <LabelWrapper label={label} required={required} error={error}>
      <select className={`${inputBase} cursor-pointer ${className ?? ''}`} required={required} {...props}>
        {options.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </LabelWrapper>
  )
}

// ── AdminCheckbox ────────────────────────────────────────────────────

interface AdminCheckboxProps {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
}

export function AdminCheckbox({ label, checked, onChange }: AdminCheckboxProps) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer group" onClick={() => onChange(!checked)}>
      <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-300 ${
        checked
          ? 'bg-gradient-to-r from-[var(--admin-primary)] to-[var(--admin-primary-dark)] border-[var(--admin-primary)]'
          : 'border-[var(--admin-border-strong)] bg-[var(--admin-input-bg)] group-hover:border-[var(--admin-primary)]/50'
      }`}>
        {checked && (
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
      <span className="text-sm text-[var(--admin-text-secondary)] font-medium group-hover:text-[var(--admin-text-primary)] transition-colors">{label}</span>
    </label>
  )
}

// ── AdminTableCheckbox ──────────────────────────────────────────────

interface AdminTableCheckboxProps {
  checked: boolean
  onChange: (checked: boolean) => void
}

export function AdminTableCheckbox({ checked, onChange }: AdminTableCheckboxProps) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`w-4 h-4 rounded-[5px] border-[1.5px] flex items-center justify-center transition-all duration-200 cursor-pointer ${
        checked
          ? 'bg-[var(--admin-primary)] border-[var(--admin-primary)] ring-2 ring-[var(--admin-primary)]/15'
          : 'border-[var(--admin-border-strong)] bg-[var(--admin-input-bg)] hover:border-[var(--admin-primary)]/60'
      }`}
    >
      {checked && (
        <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      )}
    </button>
  )
}

// ── AdminSwitch ──────────────────────────────────────────────────────

interface AdminSwitchProps {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
  description?: string
}

export function AdminSwitch({ label, checked, onChange, description }: AdminSwitchProps) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex items-center justify-between gap-4 w-full text-left group"
    >
      <div>
        <p className="text-sm font-semibold text-[var(--admin-text-primary)]">{label}</p>
        {description && <p className="text-xs text-[var(--admin-text-muted)] mt-0.5">{description}</p>}
      </div>
      <div className={`relative w-11 h-6 rounded-full transition-colors duration-300 shrink-0 ${
        checked ? 'bg-[var(--admin-primary)]' : 'bg-[var(--admin-surface-strong)]'
      }`}>
        <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-300 ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`} />
      </div>
    </button>
  )
}

// ── AdminTagInput ────────────────────────────────────────────────────

interface AdminTagInputProps {
  label: string
  tags: string[]
  onChange: (tags: string[]) => void
  placeholder?: string
  error?: string
}

export function AdminTagInput({ label, tags, onChange, placeholder = 'Appuyez Entrée pour ajouter...', error }: AdminTagInputProps) {
  const [input, setInput] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const addTag = (value: string) => {
    const trimmed = value.trim()
    if (trimmed && !tags.includes(trimmed)) {
      onChange([...tags, trimmed])
    }
    setInput('')
  }

  const removeTag = (index: number) => {
    onChange(tags.filter((_, i) => i !== index))
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTag(input)
    } else if (e.key === 'Backspace' && input === '' && tags.length > 0) {
      removeTag(tags.length - 1)
    }
  }

  return (
    <LabelWrapper label={label} error={error}>
      <div
        className={`${inputBase} flex flex-wrap gap-1.5 min-h-[42px] cursor-text !px-2.5 !py-2`}
        onClick={() => inputRef.current?.focus()}
      >
        {tags.map((tag, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-[var(--admin-primary-surface)] text-[var(--admin-primary)] border border-[var(--admin-primary)]/20"
          >
            {tag}
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); removeTag(i) }}
              className="hover:text-[var(--admin-danger)] transition-colors"
            >
              <X size={12} />
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={tags.length === 0 ? placeholder : ''}
          className="flex-1 min-w-[120px] bg-transparent outline-none text-sm text-[var(--admin-text-primary)] placeholder-[var(--admin-text-muted)]"
        />
      </div>
    </LabelWrapper>
  )
}

// ── AdminNumberInput ─────────────────────────────────────────────────

interface AdminNumberInputProps {
  label: string
  value: number | undefined
  onChange: (value: number | undefined) => void
  suffix?: string
  prefix?: string
  min?: number
  max?: number
  step?: number
  error?: string
  required?: boolean
  placeholder?: string
}

export function AdminNumberInput({ label, value, onChange, suffix, prefix, min, max, step = 1, error, required, placeholder }: AdminNumberInputProps) {
  const [localValue, setLocalValue] = useState(value?.toString() ?? '')

  useEffect(() => {
    setLocalValue(value?.toString() ?? '')
  }, [value])

  const handleChange = (raw: string) => {
    setLocalValue(raw)
    if (raw === '') {
      onChange(undefined)
    } else {
      const num = parseFloat(raw)
      if (!isNaN(num)) onChange(num)
    }
  }

  return (
    <LabelWrapper label={label} required={required} error={error}>
      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[var(--admin-text-muted)] font-medium pointer-events-none">{prefix}</span>
        )}
        <input
          type="number"
          value={localValue}
          onChange={e => handleChange(e.target.value)}
          min={min}
          max={max}
          step={step}
          required={required}
          placeholder={placeholder}
          className={`${inputBase} ${prefix ? '!pl-8' : ''} ${suffix ? '!pr-12' : ''}`}
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[var(--admin-text-muted)] font-medium pointer-events-none">{suffix}</span>
        )}
      </div>
    </LabelWrapper>
  )
}
