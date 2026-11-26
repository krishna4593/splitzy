import { useState } from 'react'
import { AlertTriangle, X } from 'lucide-react'

export function ConfirmDialog({ title, description, confirmLabel, onConfirm, trigger }) {
  const [open, setOpen] = useState(false)
  const [error, setError] = useState('')

  function confirm() {
    setError('')
    try {
      onConfirm()
      setOpen(false)
    } catch (confirmationError) {
      setError(confirmationError.message)
    }
  }

  return (
    <>
      <span onClick={() => setOpen(true)}>{trigger}</span>
      {open && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-[#142C26]/35 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setOpen(false)
          }}
        >
          <section
            aria-labelledby="confirm-title"
            aria-modal="true"
            className="w-full max-w-md rounded-2xl border border-[#E5EAE6] bg-white p-6 shadow-[0_20px_40px_-8px_rgba(15,23,42,0.12)]"
            role="dialog"
          >
            <div className="flex items-start gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FFF1EC] text-[#C45C45]">
                <AlertTriangle size={19} />
              </span>
              <div className="min-w-0 flex-1">
                <h2 className="text-lg font-semibold text-[#142C26]" id="confirm-title">
                  {title}
                </h2>
                <p className="mt-2 text-sm leading-6 text-[#718078]">{description}</p>
              </div>
              <button
                aria-label="Close dialog"
                className="rounded-lg p-1.5 text-[#718078] hover:bg-[#F4F6F4]"
                onClick={() => setOpen(false)}
                type="button"
              >
                <X size={18} />
              </button>
            </div>
            {error && (
              <p className="mt-4 rounded-lg bg-[#FFF1EC] px-3 py-2 text-sm text-[#A84938]" role="alert">
                {error}
              </p>
            )}
            <div className="mt-6 flex justify-end gap-2">
              <button
                className="rounded-lg border border-[#E2E8E3] px-4 py-2 text-sm font-medium text-[#44534B] hover:bg-[#F7F8F6]"
                onClick={() => setOpen(false)}
                type="button"
              >
                Cancel
              </button>
              <button
                className="rounded-lg bg-[#B84F3E] px-4 py-2 text-sm font-medium text-white hover:bg-[#9F4234]"
                onClick={confirm}
                type="button"
              >
                {confirmLabel}
              </button>
            </div>
          </section>
        </div>
      )}
    </>
  )
}
