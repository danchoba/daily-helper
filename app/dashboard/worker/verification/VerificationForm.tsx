'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Upload, X } from 'lucide-react'
import { Alert } from '@/components/ui/Alert'

export function VerificationForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [file, setFile] = useState<File | null>(null)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0] ?? null
    setFile(selected)
    setError('')
  }

  function removeFile() {
    setFile(null)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      let idDocumentUrl: string | null = null

      if (file) {
        const formData = new FormData()
        formData.append('file', file)
        const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData })
        const uploadData = await uploadRes.json()
        if (!uploadRes.ok) {
          setError(uploadData.error || 'File upload failed.')
          return
        }
        idDocumentUrl = uploadData.url
      }

      const res = await fetch('/api/worker/verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idDocumentUrl }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Failed to submit your request.')
        return
      }
      setSuccess(true)
      router.refresh()
    } catch {
      setError('Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="card text-center">
        <h2 className="text-2xl font-bold tracking-tight text-earth-950">Request submitted</h2>
        <p className="mt-2 text-sm leading-6 text-earth-600">
          Your verification request is in the review queue. Your profile will update after an admin approves it.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <Alert variant="info">
        <p className="font-semibold">How verification works</p>
        <p className="mt-1 text-sm leading-6">
          Submit a request and an admin will review your profile. Verified workers earn the <strong>Trusted badge</strong>, which increases your chances of being selected.
        </p>
      </Alert>

      <div className="card">
        <div className="kicker mb-2">What you get</div>
        <h2 className="text-xl font-bold tracking-tight text-earth-950">Trusted badge benefits</h2>
        <div className="mt-5 space-y-3 text-sm text-earth-600">
          <div className="flex items-start gap-3 rounded-xl border border-earth-100 bg-earth-50 p-3">
            <span className="mt-0.5 text-base">✓</span>
            <span>Your profile is highlighted with a Trusted badge visible to all customers</span>
          </div>
          <div className="flex items-start gap-3 rounded-xl border border-earth-100 bg-earth-50 p-3">
            <span className="mt-0.5 text-base">✓</span>
            <span>Customers are more likely to select verified workers</span>
          </div>
          <div className="flex items-start gap-3 rounded-xl border border-earth-100 bg-earth-50 p-3">
            <span className="mt-0.5 text-base">✓</span>
            <span>Your applications stand out in the applicant list</span>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="kicker mb-2">Request verification</div>
        <h2 className="text-xl font-bold tracking-tight text-earth-950">Apply for the Trusted badge</h2>
        {error && <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <p className="text-sm leading-6 text-earth-600">
            Make sure your profile is complete (bio, area, and services) before requesting. Admin will review your profile and approve or reject the request.
          </p>

          {/* File upload */}
          <div>
            <p className="mb-2 text-sm font-semibold text-earth-700">
              ID document <span className="font-normal text-earth-400">(optional — JPG, PNG, PDF · max 5 MB)</span>
            </p>
            {file ? (
              <div className="flex items-center justify-between rounded-xl border border-earth-200 bg-earth-50 px-4 py-3">
                <span className="truncate text-sm text-earth-700">{file.name}</span>
                <button type="button" onClick={removeFile} className="ml-3 shrink-0 text-earth-400 hover:text-red-500">
                  <X size={16} />
                </button>
              </div>
            ) : (
              <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-earth-200 bg-earth-50 px-4 py-6 transition-colors hover:border-brand-300 hover:bg-brand-50">
                <Upload size={20} className="text-earth-400" />
                <span className="text-sm text-earth-500">Click to upload a photo or PDF of your ID</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,application/pdf"
                  className="sr-only"
                  onChange={handleFileChange}
                />
              </label>
            )}
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Submitting…' : 'Submit verification request'}
          </button>
        </form>
      </div>
    </div>
  )
}
