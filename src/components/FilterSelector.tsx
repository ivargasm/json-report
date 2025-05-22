import React from 'react'
import { useFiltersStore } from '../store/filtersStore'
import { useState } from 'react'

const predefinedFilters = [
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

export default function FilterSelector() {
  const { filters, addFilter, removeFilter } = useFiltersStore()
  const [customFilter, setCustomFilter] = useState('')

  const handleCustomFilterAdd = () => {
    const trimmed = customFilter.trim()
    if (trimmed && !filters.includes(trimmed)) {
      addFilter(trimmed)
      setCustomFilter('')
    }
  }

  const handleToggleFilter = (filter: string) => {
    filters.includes(filter) ? removeFilter(filter) : addFilter(filter)
  }

  return (
    <div className="p-6 rounded-lg bg-light-contrast dark:bg-dark-contrast text-text dark:text-text-dark shadow space-y-6">
      <h2 className="text-xl font-semibold text-secondary dark:text-secondary-dark">1. Filtros del Reporte</h2>

      {/* Predefinidos */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {predefinedFilters.map((filter) => {
          const active = filters.includes(filter)
          return (
            <div
              key={filter}
              onClick={() => handleToggleFilter(filter)}
              className={`cursor-pointer rounded-lg p-4 text-center font-medium border transition
                ${
                  active
                    ? 'bg-blue-600 border-blue-400 text-white'
                    : 'bg-light-check dark:bg-dark-check border-gray-600 hover:bg-[#6082aa]'
                }`}
            >
              {filter}
            </div>
          )
        })}
      </div>

      {/* Personalizados */}
      <div className="pt-4 border-t border-gray-600">
        <label className="block text-sm mb-2">
          Agregar filtro personalizado
        </label>
        <div className="flex space-x-2">
          <input
            type="text"
            className="bg-light-check dark:bg-dark-check text-text dark:text-text-dark border border-gray-600 rounded px-3 py-2 w-64"
            placeholder="Ej. custom_products"
            value={customFilter}
            onChange={(e) => setCustomFilter(e.target.value)}
          />
          <button
            onClick={handleCustomFilterAdd}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            Agregar
          </button>
        </div>

        {/* Chips de filtros personalizados */}
        <div className="mt-4 flex flex-wrap gap-2">
          {filters
            .filter((f) => !predefinedFilters.includes(f))
            .map((filter) => (
              <div
                key={filter}
                className="bg-secondary dark:bg-primary-dark text-white px-3 py-1 rounded-full flex items-center space-x-2"
              >
                <span>{filter}</span>
                <button
                  onClick={() => removeFilter(filter)}
                  className="hover:text-gray-200 text-sm hover:cursor-pointer"
                >
                  ✕
                </button>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}
