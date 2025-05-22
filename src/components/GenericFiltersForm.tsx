import React from 'react'
import { useFiltersStore } from '../store/filtersStore'
import { useEffect } from 'react'

const schemaOptions = ['project', 'stoiii', 'stoiii_config']

export default function GenericFiltersForm() {
  const {
    filters,
    generic_filters,
    updateGenericFilter,
  } = useFiltersStore()

  // Filtros que no están en la lista de predefinidos
  const predefined = [
    'Month_periods',
    'Roles',
    'Places',
    'Subcategories',
    'Categories',
    'Products',
    'range_dates',
    'Generic',
    'custom_filters',
  ]
  const customFilters = filters.filter((f) => !predefined.includes(f))

  useEffect(() => {
    // Asegurar que haya al menos una entrada vacía para cada filtro nuevo
    customFilters.forEach((f) => {
      const alreadyExists = generic_filters.some((g) => g.selectId === f)
      if (!alreadyExists) {
        updateGenericFilter({
          selectId: f,
          schema: 'project',
          datasource: '',
          count_datasource: '',
        })
      }
    })
  }, [customFilters])

  if (customFilters.length === 0) return null

  return (
    <div className="p-6 rounded-lg bg-light-contrast dark:bg-dark-contrast text-text dark:text-text-dark shadow space-y-6 mt-6">
      <h2 className="text-xl font-semibold text-secondary dark:text-secondary-dark">
        2. Configuración de filtros personalizados
      </h2>

      {customFilters.map((filter) => {
        const item = generic_filters.find((g) => g.selectId === filter)
        if (!item) return null

        return (
          <div
            key={filter}
            className="p-4 rounded border border-gray-600 bg-li space-y-4"
          >
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-lg text-orange-300">
                {filter}
              </h3>
              <span className="text-xs text-gray-400">selectId: {item.selectId}</span>
            </div>

            {/* Schema selector */}
            <div>
              <label className="block text-sm mb-1">Schema</label>
              <select
                value={item.schema}
                onChange={(e) =>
                  updateGenericFilter({ ...item, schema: e.target.value as any })
                }
                className="bg-light-check dark:bg-dark-check border border-gray-600 p-2 rounded w-full text-white"
              >
                {schemaOptions.map((schema) => (
                  <option key={schema} value={schema}>
                    {schema}
                  </option>
                ))}
              </select>
            </div>

            {/* Datasource */}
            <div>
              <label className="block text-sm mb-1">Datasource</label>
              <textarea
                value={item.datasource}
                onChange={(e) =>
                  updateGenericFilter({ ...item, datasource: e.target.value })
                }
                className="bg-light-check dark:bg-dark-check border border-gray-600 p-2 rounded w-full text-white"
                rows={4}
                placeholder="Escribe el query principal..."
              />
            </div>

            {/* Count Datasource */}
            <div>
              <label className="block text-sm mb-1">Count datasource</label>
              <textarea
                value={item.count_datasource}
                onChange={(e) =>
                  updateGenericFilter({ ...item, count_datasource: e.target.value })
                }
                className="bg-light-check dark:bg-dark-check border border-gray-600 p-2 rounded w-full text-white"
                rows={3}
                placeholder="Escribe el query de conteo..."
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
