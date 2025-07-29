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
import toast, { Toaster } from 'react-hot-toast'

export default function ReporteConfigPage() {
    const {
        components,
        clear: resetComponents,
        loadFromJSON: loadComponents,
    } = useComponentsStore()
    const {
        reset: resetFilters,
        loadFromJSON: loadFilters,
    } = useFiltersStore()

    const handleCargarJSON = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        const reader = new FileReader()
        reader.onload = (e) => {
            try {
                const json = JSON.parse(e.target?.result as string)
                loadFilters(json)
                loadComponents(json)
                toast.success('JSON cargado correctamente.')
            } catch {
                toast.error('Error al leer el JSON.')
            }
        }
        reader.readAsText(file)
    }

    return (
        <div className="min-h-screen bg-bg dark:bg-bg-dark p-8 space-y-8 min-w-full mx-auto">
            <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
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

                {/* Renderizar cada componente configurador según su tipo */}
                {components.map((comp) =>
                    comp.type === 'resume' ? (
                        <ComponentResumeConfigurator key={comp.id} componentId={comp.id} />
                    ) : (
                        <ComponentTableConfigurator key={comp.id} componentId={comp.id} />
                    )
                )}

                {/* Vista previa final */}
                <VistaPreviaJSON />

                {/* Acciones */}
                <div className="flex items-center gap-4 mt-6">
                    <button
                        onClick={() => {
                            if (confirm('¿Seguro que deseas limpiar toda la configuración?')) {
                                resetComponents()
                                resetFilters()
                            }
                        }}
                        className="bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded"
                    >
                        Limpiar todo
                    </button>

                    <label className="bg-purple-700 hover:bg-purple-800 text-white px-4 py-2 rounded cursor-pointer">
                        Cargar JSON existente
                        <input
                            type="file"
                            accept=".json"
                            onChange={handleCargarJSON}
                            className="hidden"
                        />
                    </label>
                </div>
            </div>
        </div>
    )
}
