import { useComponentsStore } from '../store/componentsStore'
import { useState, useMemo } from 'react'

const columnFlags = ['is_number', 'is_amount', 'is_percent', 'is_image'] as const
type ColumnFlag = typeof columnFlags[number]

export default function ComponentResumeConfigurator() {
  const { resume, setComponent } = useComponentsStore()
  const [newRowDescription, setNewRowDescription] = useState('')

  // ✅ useMemo fuera de condiciones (para evitar error de hooks)
  const flatParsed = useMemo(() => {
    if (!resume?.parsedColumns?.length) return []
    return resume.parsedColumns.map((item) => {
      const colName =
        'column' in item
          ? (item as any).column
          : (item as any).columns?.[0]?.column
      const desc = item.description || colName
      return { column: colName, description: desc }
    })
  }, [resume?.parsedColumns])

  // 🚫 Salimos si no hay componente cargado o columnas parseadas
  if (!resume || flatParsed.length === 0) return null

  const updateRowDescription = (idx: number, value: string) => {
    const rows = [...(resume.rows ?? [])]
    rows[idx].description = value
    setComponent({ ...resume, rows })
  }

  const handleAddRow = () => {
    if (!newRowDescription.trim()) return
    const newRow = { description: newRowDescription, columns: [] }
    setComponent({ ...resume, rows: [...(resume.rows ?? []), newRow] })
    setNewRowDescription('')
  }

  const toggleColumnInRow = (rowIdx: number, columnName: string) => {
    const rows = [...(resume.rows ?? [])]
    const row = rows[rowIdx]
    const exists = row.columns.find((c) => c.column === columnName)

    const newCols = exists
      ? row.columns.filter((c) => c.column !== columnName)
      : [...row.columns, { column: columnName, is_number: true }]

    rows[rowIdx] = { ...row, columns: newCols }
    setComponent({ ...resume, rows })
  }

  const toggleFlag = (
    rowIdx: number,
    columnName: string,
    flag: ColumnFlag
  ) => {
    const rows = [...(resume.rows ?? [])]
    const row = rows[rowIdx]
    const col = row.columns.find((c) => c.column === columnName)
    if (!col) return
    col[flag] = !col[flag]
    rows[rowIdx] = { ...row, columns: [...row.columns] }
    setComponent({ ...resume, rows })
  }

  return (
    <div className="p-6 bg-light-contrast dark:bg-dark-contrast text-text dark:text-text-dark rounded shadow mt-6 space-y-6">
      <h2 className="text-xl font-semibold text-secondary dark:text-secondary-dark">
        6. Configurar filas del resumen
      </h2>

      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={newRowDescription}
          onChange={(e) => setNewRowDescription(e.target.value)}
          className="bg-light-check dark:bg-dark-check border border-gray-600 p-2 rounded flex-1"
          placeholder="Descripción de la fila"
        />
        <button
          onClick={handleAddRow}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          Agregar fila
        </button>
      </div>

      {(resume.rows ?? []).map((row, rowIdx) => (
        <div
          key={rowIdx}
          className="bg-light-contrast dark:bg-dark-contrast p-4 rounded border border-gray-700 space-y-4"
        >
          {/* Descripción editable */}
          <div>
            <label className="block text-sm mb-1">Descripción de la fila</label>
            <input
              type="text"
              value={row.description}
              onChange={(e) => updateRowDescription(rowIdx, e.target.value)}
              className="bg-light-check dark:bg-dark-check border border-gray-600 px-3 py-2 rounded w-full"
            />
          </div>

          {/* Selección de columnas */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {flatParsed.map((col) => {
              const sel = row.columns.some((c) => c.column === col.column)
              return (
                <div
                  key={col.column}
                  onClick={() => toggleColumnInRow(rowIdx, col.column)}
                  className={`cursor-pointer px-2 py-1.5 rounded text-md text-center font-medium transition border whitespace-nowrap overflow-hidden text-ellipsis
                    ${
                      sel
                        ? 'bg-blue-600 border-blue-400 text-white'
                        : 'bg-[#33334d] border-gray-600 hover:bg-[#3e3e5e]'
                    }`}
                  title={col.column}
                >
                  {col.column}
                </div>
              )
            })}
          </div>

          {/* Toggles de flags por columna seleccionada */}
          {row.columns.length > 0 && (
            <div className="space-y-4 mt-4">
              {row.columns.map((col) => (
                <div key={col.column}>
                  <h4 className="text-sm font-semibold mb-1 text-orange-200">
                    {col.column}
                  </h4>
                  <div className="flex gap-2 flex-wrap">
                    {columnFlags.map((flag) => (
                      <div
                        key={flag}
                        onClick={() => toggleFlag(rowIdx, col.column, flag)}
                        className={`cursor-pointer px-2 py-1 rounded text-xs font-medium transition border
                          ${
                            col[flag]
                              ? 'bg-green-600 border-green-400 text-white'
                              : 'bg-[#3e3e5e] border-gray-500 text-gray-300'
                          }`}
                      >
                        {flag.replace('is_', '').toUpperCase()}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
