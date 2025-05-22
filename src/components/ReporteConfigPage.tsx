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
    const { reset: resetComponents } = useComponentsStore()
    const { reset: resetFilters } = useFiltersStore()
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

            </div>
        </div>
    )
}
