import { useComponentsStore } from '../../store/componentsStore'
import { useState } from 'react'

export default function ComponentBasicCardConfigurator({ componentId }: { componentId: string }) {
  const { components, updateComponent } = useComponentsStore()
  const card = components.find((c) => c.id === componentId && c.type === 'basic_card')
  const [newDesc, setNewDesc] = useState('')

  if (!card) return null

  const handleAddDesc = () => {
    if (!newDesc.trim()) return
    updateComponent(card.id, { descriptions: [...(card.descriptions || []), newDesc.trim()] })
    setNewDesc('')
  }

  const handleRemoveDesc = (idx: number) => {
    const arr = [...(card.descriptions || [])]
    arr.splice(idx, 1)
    updateComponent(card.id, { descriptions: arr })
  }

  return (
    <div className="p-6 bg-light-contrast dark:bg-dark-contrast border border-gray-200 dark:border-dark-check text-text dark:text-text-dark rounded shadow mt-6 space-y-4">
      <h2 className="text-xl font-semibold text-text dark:text-text-dark ">Configurar Basic Card ({card.title})</h2>
      <div className="flex items-center space-x-2">
        <input 
          type="text" 
          value={newDesc} 
          onChange={(e) => setNewDesc(e.target.value)} 
          className="bg-bg dark:bg-bg-dark border border-gray-200 dark:border-dark-check p-2 rounded flex-1" 
          placeholder="Nueva descripción (ej: Período: &c_period&)" 
        />
        <button 
          onClick={handleAddDesc} 
          className="bg-primary text-white hover:bg-blue-700 shadow-sm font-semibold  px-4 py-2 rounded"
        >
          Agregar descripción
        </button>
      </div>
      {(card.descriptions || []).map((desc, idx) => (
        <div key={idx} className="flex justify-between items-center bg-light-check dark:bg-[#33334d] p-3 rounded border border-gray-700">
          <span>{desc}</span>
          <button onClick={() => handleRemoveDesc(idx)} className="text-red-500 hover:text-red-700">Eliminar</button>
        </div>
      ))}
    </div>
  )
}
