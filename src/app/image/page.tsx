'use client'

import { analyzeImage } from '@/lib/actionsIA'
import { useState } from 'react'

export default function Home() {
  const [result, setResult] = useState<string>('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    try {
      setLoading(true)
      const response = await analyzeImage(formData)
      setResult(response)
    } catch (error) {
      console.error(error)
      setResult('Error al procesar la imagen')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <h1 className="text-2xl font-bold">Análisis de Imagen con Gemini</h1>
        
        <form action={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-2">
              Imagen:
              <input
                type="file"
                name="image"
                accept="image/*"
                required
                className="block w-full mt-1 border rounded-md p-2"
              />
            </label>
          </div>

          <div>
            <label className="block mb-2">
              Prompt:
              <input
                type="text"
                name="prompt"
                required
                className="block w-full mt-1 border rounded-md p-2"
                placeholder="¿Qué quieres saber sobre la imagen?"
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Procesando...' : 'Analizar Imagen'}
          </button>
        </form>

        {result && (
          <div className="mt-8 p-4 border rounded-md">
            <h2 className="font-bold mb-2">Resultado:</h2>
            <p className="whitespace-pre-wrap">{result}</p>
          </div>
        )}
      </div>
    </main>
  )
}