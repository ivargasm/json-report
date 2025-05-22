import { useComponentsStore } from '../store/componentsStore'
import React from 'react'
import { useEffect } from 'react'

export default function ComponentTableConfigurator() {
  const {
    table,
    setComponent,
  } = useComponentsStore()

  // Inicializar columnas editables a partir de parsedColumns
  useEffect(() => {
    if (table.parsedColumns && table.parsedColumns.length && table.columns?.length === 0) {
      const editableColumns = table.parsedColumns.map((col) => ({
        ...col,
        is_number: false,
        is_sortable: false,
        is_percent: false,
        is_image: false,
      }))
      setComponent({
        ...table,
        columns: editableColumns,
      })
    }
  }, [table.parsedColumns])

  const updateColumn = (index: number, changes: Partial<NonNullable<typeof table.columns>[number]>) => {
    if (!table.columns) return; // Guard clause if columns is undefined
    
    const updated = table.columns.map((col, i) =>
      i === index ? { ...col, ...changes } : col
    )
    setComponent({ ...table, columns: updated })
  }

  if (!table.columns?.length) return null

  return (
    <div className="p-6 bg-light-contrast dark:bg-dark-contrast text-text dark:text-text-dark rounded shadow mt-6 space-y-6">
      <h2 className="text-xl font-semibold text-secondary dark:text-secondary-dark">5. Configurar columnas de tabla</h2>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="border-b border-gray-700">
            <tr>
              <th className="py-2 px-4">Campo</th>
              <th className="py-2 px-4">Descripción</th>
              <th className="py-2 px-4">Número</th>
              <th className="py-2 px-4">Ordenable</th>
              <th className="py-2 px-4">%</th>
              <th className="py-2 px-4">Imagen</th>
            </tr>
          </thead>
          <tbody>
            {table.columns.map((col, i) => (
              <tr key={i} className="border-b border-gray-800">
                <td className="py-2 px-4 font-mono">{col.column}</td>
                <td className="py-2 px-4">
                  <input
                    value={col.description}
                    onChange={(e) =>
                      updateColumn(i, { description: e.target.value })
                    }
                    className="bg-light-check dark:bg-dark-check border border-gray-600 px-2 py-1 rounded w-full"
                  />
                </td>
                <td className="py-2 px-4 text-center">
                  <input
                    type="checkbox"
                    checked={col.is_number}
                    onChange={(e) => updateColumn(i, { is_number: e.target.checked })}
                  />
                </td>
                <td className="py-2 px-4 text-center">
                  <input
                    type="checkbox"
                    checked={col.is_sortable}
                    onChange={(e) => updateColumn(i, { is_sortable: e.target.checked })}
                  />
                </td>
                <td className="py-2 px-4 text-center">
                  <input
                    type="checkbox"
                    checked={col.is_percent}
                    onChange={(e) => updateColumn(i, { is_percent: e.target.checked })}
                  />
                </td>
                <td className="py-2 px-4 text-center">
                  <input
                    type="checkbox"
                    checked={col.is_image}
                    onChange={(e) => updateColumn(i, { is_image: e.target.checked })}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
