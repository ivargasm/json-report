import { useFiltersStore } from '../store/filtersStore'
import React from 'react'

export default function DefaultFilterProperties() {
  const {
    filters,
    filters_properties,
    updateDefaultValue,
  } = useFiltersStore()

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

  if (customFilters.length === 0) return null

  return (
    <div className="p-6 rounded-lg bg-light-contrast dark:bg-dark-contrast text-text dark:text-text-dark shadow space-y-6 mt-6">
      <h2 className="text-xl font-semibold text-secondary dark:text-secondary-dark">
        3. Valores por defecto para filtros personalizados
      </h2>

      {customFilters.map((filter) => {
        const current = filters_properties[filter]?.default_value ?? {
          value: '',
          description: '',
        }

        return (
          <div
            key={filter}
            className="p-4 border border-gray-600 rounded bg-light-contrast dark:bg-dark-contrast space-y-4"
          >
            <h3 className="font-semibold text-lg text-primary dark:text-primary-dark">{filter}</h3>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1">Valor por defecto</label>
                <input
                  type="text"
                  value={current.value}
                  onChange={(e) =>
                    updateDefaultValue(filter, {
                      ...current,
                      value: e.target.value,
                    })
                  }
                  className="bg-light-check dark:bg-dark-check border border-gray-600 p-2 rounded w-full text-white"
                  placeholder="Ej: -1"
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Descripción</label>
                <input
                  type="text"
                  value={current.description}
                  onChange={(e) =>
                    updateDefaultValue(filter, {
                      ...current,
                      description: e.target.value,
                    })
                  }
                  className="bg-light-check dark:bg-dark-check border border-gray-600 p-2 rounded w-full text-white"
                  placeholder="Ej: Todos los productos"
                />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
