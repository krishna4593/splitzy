export function Avatar({ name, tone = 'green', size = 'md' }) {
  const tones = {
    green: 'bg-[#D9EEE5] text-[#16834B]',
    blue: 'bg-[#E3ECFF] text-[#476A9F]',
    peach: 'bg-[#F9E8DD] text-[#A65E3E]',
    purple: 'bg-[#EFE7F7] text-[#77589A]',
  }
  const sizes = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
  }

  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()

  return (
    <span
      aria-hidden="true"
      className={`inline-flex shrink-0 items-center justify-center rounded-full font-semibold ${tones[tone]} ${sizes[size]}`}
    >
      {initials}
    </span>
  )
}
