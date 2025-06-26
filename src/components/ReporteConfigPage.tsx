import FilterSelector from './FilterSelector'
import GenericFiltersForm from './GenericFiltersForm'
import DefaultFilterProperties from './DefaultFilterProperties'
import FormularioComponenteBase from './FormularioComponenteBase'
import ComponentTableConfigurator from './ComponentTableConfigurator'
import ComponentResumeConfigurator from './ComponentResumeConfigurator'
import VistaPreviaJSON from './VistaPreviaJSON'
import React from 'react'
import { useComponentsStore } from '../store/componentsStore'
import { useFiltersStore } from '../store/filtersStore'

export default function ReporteConfigPage() {
    const { reset: resetComponents, clearResume, clearTable, loadFromJSON: loadComponents } = useComponentsStore()
    const { reset: resetFilters, clearFilters, loadFromJSON: loadFilters } = useFiltersStore()

    const handleCargarJSON = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        const reader = new FileReader()
        reader.onload = (e) => {
            try {
                const json = JSON.parse(e.target?.result as string)
                loadFilters(json)
                loadComponents(json)
                alert('JSON cargado correctamente.')
            } catch {
                alert('Error al leer el JSON.')
            }
        }
        reader.readAsText(file)
    }
    return (
        <div className="min-h-screen bg-bg dark:bg-bg-dark p-8 space-y-8 min-w-full mx-auto">
            <div className="max-w-[70%] mx-auto">
                <h1 className="text-3xl font-bold mb-6 text-primary dark:text-primary-dark">
                    Configurador de Reporte JSON
                </h1>

                {/* Sección de filtros */}
                <FilterSelector />
                <GenericFiltersForm />
                <DefaultFilterProperties />

                {/* Sección de componentes */}
                <FormularioComponenteBase />
                <ComponentTableConfigurator />
                <ComponentResumeConfigurator />

                {/* Vista previa final */}
                <VistaPreviaJSON />

                <button
                    onClick={() => {
                        if (confirm('¿Seguro que deseas limpiar toda la configuración?')) {
                            resetComponents()
                            resetFilters()
                        }
                    }}
                    className="bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded btn mt-6"
                >
                    Limpiar todo
                </button>
                <label className="bg-purple-700 hover:bg-purple-800 text-white px-4 py-2 rounded cursor-pointer ml-2">
                    Cargar JSON existente
                    <input type="file" accept=".json" onChange={handleCargarJSON} className="hidden" />
                </label>


            </div>
        </div>
    )
}
