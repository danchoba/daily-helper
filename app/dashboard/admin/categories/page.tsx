'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, Pencil, Trash2, X, Check, Loader2 } from 'lucide-react'

interface Category {
  id: string
  name: string
  slug: string
  icon: string | null
  _count: { jobs: number }
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [newName, setNewName] = useState('')
  const [newIcon, setNewIcon] = useState('')
  const [adding, setAdding] = useState(false)
  const [addError, setAddError] = useState('')
  const [editId, setEditId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [editIcon, setEditIcon] = useState('')
  const [saving, setSaving] = useState(false)
  const [deleteError, setDeleteError] = useState<Record<string, string>>({})

  async function load() {
    try {
      const res = await fetch('/api/admin/categories')
      if (res.ok) setCategories(await res.json())
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  async function addCategory(e: React.FormEvent) {
    e.preventDefault()
    if (!newName.trim()) return
    setAdding(true)
    setAddError('')
    try {
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName.trim(), icon: newIcon.trim() }),
      })
      const data = await res.json()
      if (!res.ok) { setAddError(data.error || 'Failed to add'); return }
      setNewName('')
      setNewIcon('')
      await load()
    } finally {
      setAdding(false)
    }
  }

  function startEdit(cat: Category) {
    setEditId(cat.id)
    setEditName(cat.name)
    setEditIcon(cat.icon || '')
  }

  async function saveEdit(id: string) {
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/categories/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editName.trim(), icon: editIcon.trim() }),
      })
      if (res.ok) { setEditId(null); await load() }
    } finally {
      setSaving(false)
    }
  }

  async function deleteCategory(id: string) {
    setDeleteError(prev => ({ ...prev, [id]: '' }))
    const res = await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setCategories(prev => prev.filter(c => c.id !== id))
    } else {
      const data = await res.json()
      setDeleteError(prev => ({ ...prev, [id]: data.error || 'Failed to delete' }))
    }
  }

  return (
    <div className="max-w-3xl">
      <Link href="/dashboard/admin" className="subtle-link inline-flex items-center gap-2">Back to admin</Link>
      <h1 className="page-title mt-3 mb-6">Categories</h1>

      {/* Add new */}
      <form onSubmit={addCategory} className="card mb-6">
        <p className="mb-4 text-sm font-bold text-earth-900">Add a new category</p>
        <div className="flex gap-3">
          <input
            className="input flex-1"
            placeholder="Category name (e.g. Plumbing)"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            maxLength={60}
            required
          />
          <input
            className="input w-20"
            placeholder="Icon"
            value={newIcon}
            onChange={e => setNewIcon(e.target.value)}
            maxLength={10}
            aria-label="Emoji icon (optional)"
          />
          <button type="submit" disabled={adding || !newName.trim()} className="btn-primary">
            {adding ? <Loader2 size={15} className="animate-spin" /> : <Plus size={15} />}
            Add
          </button>
        </div>
        {addError && <p className="mt-2 text-xs text-red-600">{addError}</p>}
      </form>

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 size={20} className="animate-spin text-earth-400" />
        </div>
      ) : categories.length === 0 ? (
        <p className="text-sm text-earth-500">No categories yet.</p>
      ) : (
        <div className="space-y-2">
          {categories.map(cat => (
            <div key={cat.id} className="card">
              {editId === cat.id ? (
                <div className="flex items-center gap-3">
                  <input
                    className="input w-12"
                    value={editIcon}
                    onChange={e => setEditIcon(e.target.value)}
                    maxLength={10}
                    aria-label="Icon"
                  />
                  <input
                    className="input flex-1"
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    maxLength={60}
                    autoFocus
                  />
                  <button onClick={() => saveEdit(cat.id)} disabled={saving} className="btn-primary py-2">
                    {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                  </button>
                  <button onClick={() => setEditId(null)} className="btn-outline py-2">
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    {cat.icon && <span className="text-xl">{cat.icon}</span>}
                    <div>
                      <p className="font-semibold text-earth-900">{cat.name}</p>
                      <p className="text-xs text-earth-400">
                        slug: <span className="font-mono">{cat.slug}</span> · {cat._count.jobs} job{cat._count.jobs !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => startEdit(cat)}
                      className="rounded-lg p-2 text-earth-400 transition-colors hover:bg-earth-100 hover:text-earth-700"
                      aria-label={`Edit ${cat.name}`}
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => deleteCategory(cat.id)}
                      disabled={cat._count.jobs > 0}
                      title={cat._count.jobs > 0 ? 'Cannot delete — has jobs' : 'Delete category'}
                      className="rounded-lg p-2 text-earth-400 transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-30 disabled:cursor-not-allowed"
                      aria-label={`Delete ${cat.name}`}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              )}
              {deleteError[cat.id] && (
                <p className="mt-2 text-xs text-red-600">{deleteError[cat.id]}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
