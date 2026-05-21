'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

interface ThemeCustomizerProps {
  profile: any
  onSuccess: () => void
}

export default function ThemeCustomizer({ profile, onSuccess }: ThemeCustomizerProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    theme_color: profile?.theme_color || '#6366f1',
    background_color: profile?.background_color || '#faf7ff',
    button_style: profile?.button_style || 'rounded'
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { error } = await supabase
        .from('profiles')
        .update({
          theme_color: formData.theme_color,
          background_color: formData.background_color,
          button_style: formData.button_style,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)

      if (error) throw error
      
      alert('Theme updated successfully!')
      onSuccess()
    } catch (error: any) {
      alert('Error: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const buttonStyles = [
    { value: 'rounded', label: 'Rounded' },
    { value: 'square', label: 'Square' },
    { value: 'pill', label: 'Pill' }
  ]

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Theme Color</label>
        <div className="flex items-center space-x-2">
          <input
            type="color"
            value={formData.theme_color}
            onChange={(e) => setFormData({ ...formData, theme_color: e.target.value })}
            className="w-12 h-12 rounded"
          />
          <input
            type="text"
            value={formData.theme_color}
            onChange={(e) => setFormData({ ...formData, theme_color: e.target.value })}
            className="mt-1 block w-32 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Background Color</label>
        <div className="flex items-center space-x-2">
          <input
            type="color"
            value={formData.background_color}
            onChange={(e) => setFormData({ ...formData, background_color: e.target.value })}
            className="w-12 h-12 rounded"
          />
          <input
            type="text"
            value={formData.background_color}
            onChange={(e) => setFormData({ ...formData, background_color: e.target.value })}
            className="mt-1 block w-32 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Button Style</label>
        <select
          value={formData.button_style}
          onChange={(e) => setFormData({ ...formData, button_style: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          {buttonStyles.map((style) => (
            <option key={style.value} value={style.value}>
              {style.label}
            </option>
          ))}
        </select>
      </div>

      <div className="p-4 border rounded-md">
        <h4 className="text-sm font-medium mb-2">Preview:</h4>
        <div 
          className="p-4 rounded-md"
          style={{ backgroundColor: formData.background_color }}
        >
          <button
            className={`px-4 py-2 font-semibold text-white`}
            style={{ 
              backgroundColor: formData.theme_color,
              borderRadius: 
                formData.button_style === 'rounded' ? '0.375rem' :
                formData.button_style === 'square' ? '0' : '9999px'
            }}
          >
            Example Button
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Updating...' : 'Save Theme'}
      </button>
    </form>
  )
}
