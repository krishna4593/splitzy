export function PageHeader({ title, description, action }) {
  return (
    <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-[#142C26] sm:text-[28px]">
          {title}
        </h1>
        {description && <p className="mt-1 text-sm text-[#718078]">{description}</p>}
      </div>
      {action}
    </div>
  )
}
