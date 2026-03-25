import { useComponentsStore } from '../../store/componentsStore'
import { useState } from 'react'

export default function ComponentBasicTreeConfigurator({ componentId }: { componentId: string }) {
  const { components, updateComponent } = useComponentsStore()
  const tree = components.find((c) => c.id === componentId && c.type === 'basic_tree')

  if (!tree) return null

  const t = tree.tree || { root_column: '', root_value: null, dsc_column: '', children: { parent_column: '', child_column: '', dsc_column: '', children: null } }
  const children = t.children || { parent_column: '', child_column: '', dsc_column: '', children: null }

  const handleUpdateTree = (field: string, value: any) => {
    updateComponent(tree.id, { tree: { ...t, [field]: value } })
  }

  const handleUpdateChildren = (field: string, value: any) => {
    updateComponent(tree.id, { tree: { ...t, children: { ...children, [field]: value } } })
  }
  
  const handleAddCol = (arrKey: 'columns'|'treeColumns', key: string, label: string, type: string) => {
    const arr = [...(tree[arrKey] || [])]
    arr.push({ key, label, type })
    updateComponent(tree.id, { [arrKey]: arr })
  }

  const handleRemoveCol = (arrKey: 'columns'|'treeColumns', idx: number) => {
    const arr = [...(tree[arrKey] || [])]
    arr.splice(idx, 1)
    updateComponent(tree.id, { [arrKey]: arr })
  }

  return (
    <div className="p-6 bg-light-contrast dark:bg-dark-contrast border border-gray-200 dark:border-dark-check text-text dark:text-text-dark rounded shadow mt-6 space-y-6">
      <h2 className="text-xl font-semibold text-text dark:text-text-dark ">Configurar Basic Tree ({tree.title})</h2>
      
      <div className="p-4 bg-light-check dark:bg-[#33334d] rounded border border-gray-700 space-y-3">
        <h3 className="font-semibold text-orange-200">Estructura del Árbol (tree)</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm mb-1">Root Column</label>
            <input type="text" value={t.root_column || ''} onChange={(e) => handleUpdateTree('root_column', e.target.value)} className="bg-light-contrast dark:bg-dark-contrast dark:border-dark-check border border-gray-200 dark:border-dark-check p-2 rounded w-full" placeholder="ej: parent_id" />
          </div>
          <div>
            <label className="block text-sm mb-1">Root Value (usar null o valor literal)</label>
            <input type="text" value={t.root_value === null ? 'null' : t.root_value} onChange={(e) => handleUpdateTree('root_value', e.target.value === 'null' ? null : e.target.value)} className="bg-light-contrast dark:bg-dark-contrast dark:border-dark-check border border-gray-200 dark:border-dark-check p-2 rounded w-full" />
          </div>
          <div>
            <label className="block text-sm mb-1">Dsc Column</label>
            <input type="text" value={t.dsc_column || ''} onChange={(e) => handleUpdateTree('dsc_column', e.target.value)} className="bg-light-contrast dark:bg-dark-contrast dark:border-dark-check border border-gray-200 dark:border-dark-check p-2 rounded w-full" placeholder="ej: dsc" />
          </div>
        </div>
        
        <h4 className="font-semibold text-sm mt-4 text-blue-300">Nivel Hijo (children)</h4>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm mb-1">Parent Column</label>
            <input type="text" value={children.parent_column || ''} onChange={(e) => handleUpdateChildren('parent_column', e.target.value)} className="bg-light-contrast dark:bg-dark-contrast dark:border-dark-check border border-gray-200 dark:border-dark-check p-2 rounded w-full" placeholder="ej: parent_id" />
          </div>
          <div>
            <label className="block text-sm mb-1">Child Column</label>
            <input type="text" value={children.child_column || ''} onChange={(e) => handleUpdateChildren('child_column', e.target.value)} className="bg-light-contrast dark:bg-dark-contrast dark:border-dark-check border border-gray-200 dark:border-dark-check p-2 rounded w-full" placeholder="ej: child_id" />
          </div>
          <div>
            <label className="block text-sm mb-1">Dsc Column</label>
            <input type="text" value={children.dsc_column || ''} onChange={(e) => handleUpdateChildren('dsc_column', e.target.value)} className="bg-light-contrast dark:bg-dark-contrast dark:border-dark-check border border-gray-200 dark:border-dark-check p-2 rounded w-full" placeholder="ej: dsc" />
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <ColumnManager title="Columns (Datos directos)" items={tree.columns || []} onAdd={(k: string, l: string, t: string) => handleAddCol('columns', k, l, t)} onRemove={(i: number) => handleRemoveCol('columns', i)} />
        <ColumnManager title="Tree Columns (Datos agregados)" items={tree.treeColumns || []} onAdd={(k: string, l: string, t: string) => handleAddCol('treeColumns', k, l, t)} onRemove={(i: number) => handleRemoveCol('treeColumns', i)} />
      </div>
    </div>
  )
}

function ColumnManager({ title, items, onAdd, onRemove }: any) {
  const [k, setK] = useState('')
  const [l, setL] = useState('')
  const [t, setT] = useState('number')
  
  return (
    <div className="p-4 bg-light-check dark:bg-[#33334d] border border-gray-700 rounded space-y-3">
      <h3 className="font-semibold">{title}</h3>
      <div className="flex gap-2">
         <input placeholder="Key" value={k} onChange={e=>setK(e.target.value)} className="bg-light-contrast dark:bg-dark-contrast dark:border-dark-check border border-gray-200 dark:border-dark-check p-1 text-sm rounded w-1/3" />
         <input placeholder="Label" value={l} onChange={e=>setL(e.target.value)} className="bg-light-contrast dark:bg-dark-contrast dark:border-dark-check border border-gray-200 dark:border-dark-check p-1 text-sm rounded w-1/3" />
         <select value={t} onChange={e=>setT(e.target.value)} className="bg-light-contrast dark:bg-dark-contrast dark:border-dark-check border border-gray-200 dark:border-dark-check p-1 text-sm rounded w-1/4">
            <option value="number">number</option>
            <option value="text">text</option>
         </select>
         <button onClick={() => { if(k && l) { onAdd(k, l, t); setK(''); setL('') } }} className="bg-primary hover:bg-blue-700 shadow-sm font-semibold text-white p-1 rounded">Add</button>
      </div>
      <div className="space-y-1 mt-2">
        {items.map((it:any, i:number) => (
          <div key={i} className="flex justify-between text-sm bg-light-contrast dark:bg-dark-contrast border border-gray-200 dark:border-dark-check p-1 px-2 rounded">
            <span>{it.key} - {it.label} ({it.type})</span>
            <button onClick={() => onRemove(i)} className="text-red-500 hover:text-red-700">X</button>
          </div>
        ))}
      </div>
    </div>
  )
}
