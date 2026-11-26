import { useState } from 'react'
import { CircleAlert, Save, Settings2 } from 'lucide-react'
import { PageHeader } from '../components/PageHeader.jsx'
import { useGroup } from '../app/useGroup.js'

export function SettingsPage() {
  const { group } = useGroup()
  return (
    <SettingsForm
      group={group}
      key={group.members.length}
    />
  )
}

function SettingsForm({ group }) {
  const { saveSettings } = useGroup()
  const [groupName, setGroupName] = useState(group.settings.groupName)
  const [currentMemberId, setCurrentMemberId] = useState(group.settings.currentMemberId)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  function submit(event) {
    event.preventDefault()
    setError('')
    setSaved(false)
    try {
      saveSettings({ groupName, currentMemberId })
      setSaved(true)
    } catch (saveError) {
      setError(saveError.message)
    }
  }

  return (
    <div>
      <PageHeader title="Settings" description="Personalize this group on your device." />
      <section className="max-w-2xl rounded-2xl border border-[#E5EAE6] bg-white p-5 sm:p-7">
        <div className="mb-6 flex items-start gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF4EF] text-[#16834B]">
            <Settings2 size={19} />
          </span>
          <div>
            <h2 className="text-base font-semibold text-[#142C26]">Group preferences</h2>
            <p className="mt-1 text-sm text-[#87938D]">Your group data stays in this browser.</p>
          </div>
        </div>
        <form className="space-y-5" onSubmit={submit}>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#425148]" htmlFor="group-name">Group name</label>
            <input
              className="w-full rounded-lg border border-[#DDE5DF] px-3.5 py-2.5 text-sm outline-none focus:border-[#16834B] focus:ring-4 focus:ring-[#16834B]/10"
              id="group-name"
              maxLength={60}
              onChange={(event) => {
                setGroupName(event.target.value)
                setSaved(false)
              }}
              value={groupName}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#425148]" htmlFor="current-member">Your profile</label>
            <select
              className="w-full rounded-lg border border-[#DDE5DF] bg-white px-3.5 py-2.5 text-sm outline-none focus:border-[#16834B] focus:ring-4 focus:ring-[#16834B]/10"
              id="current-member"
              onChange={(event) => {
                setCurrentMemberId(event.target.value)
                setSaved(false)
              }}
              value={currentMemberId}
            >
              {group.members.length === 0 && <option value="">Add members first</option>}
              {group.members.map((member) => <option key={member.id} value={member.id}>{member.name}</option>)}
            </select>
          </div>
          {error && (
            <p className="flex items-center gap-2 rounded-lg bg-[#FFF4F0] px-3 py-2.5 text-sm text-[#A84938]" role="alert">
              <CircleAlert size={16} />
              {error}
            </p>
          )}
          {saved && <p className="text-sm font-medium text-[#16834B]" role="status">Settings saved.</p>}
          <button
            className="inline-flex items-center gap-2 rounded-lg bg-[#16834B] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#126C3E]"
            type="submit"
          >
            <Save size={16} />
            Save settings
          </button>
        </form>
      </section>
    </div>
  )
}
