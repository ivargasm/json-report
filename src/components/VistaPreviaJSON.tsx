import { useFiltersStore } from '../store/filtersStore'
import { useComponentsStore, ReportComponent } from '../store/componentsStore'
import { useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'

// Limpia saltos de línea y múltiples espacios
const cleanQuery = (query: string | undefined): string => {
    if (!query) return ''
    return query.replace(/\s+/g, ' ').trim()
}

// Limpia campos tipo query dentro del componente
const cleanComponentQueries = (comp: ReportComponent): ReportComponent => {
    const cleaned = JSON.parse(JSON.stringify(comp))

    if (cleaned.datasource) cleaned.datasource = cleanQuery(cleaned.datasource)
    if (cleaned.count_datasource) cleaned.count_datasource = cleanQuery(cleaned.count_datasource)
    if (cleaned.last_date_datasource) cleaned.last_date_datasource = cleanQuery(cleaned.last_date_datasource)

    return cleaned
}

// Limpia filtros genéricos (si aplica)
const cleanGenericFilters = (filters: any[]) => {
    return filters.map(filter => ({
        ...filter,
        datasource: cleanQuery(filter.datasource),
        count_datasource: cleanQuery(filter.count_datasource)
    }))
}

export default function VistaPreviaJSON() {
    const { filters, generic_filters, filters_properties } = useFiltersStore()
    const { components } = useComponentsStore()

    const [copied, setCopied] = useState(false)
    const [copiedMinified, setCopiedMinified] = useState(false)

    // Eliminar `parsedColumns` antes de exportar
    const cleanComponent = (comp: ReportComponent): ReportComponent => {
        const { parsedColumns, ...rest } = comp
        return rest
    }

    const jsonFinal = {
        filters,
        ...(generic_filters.length > 0 && { generic_filters: cleanGenericFilters(generic_filters) }),
        ...(Object.keys(filters_properties).length > 0 && { filters_properties }),
        components: components.map(comp => cleanComponentQueries(cleanComponent(comp))),
    }

    const jsonString = JSON.stringify(jsonFinal, null, 2)
    const minifiedJsonString = JSON.stringify(jsonFinal)

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(jsonString)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            toast.error('Error al copiar')
        }
    }

    const handleCopyMinified = async () => {
        try {
            await navigator.clipboard.writeText(minifiedJsonString)
            setCopiedMinified(true)
            setTimeout(() => setCopiedMinified(false), 2000)
        } catch (err) {
            toast.error('Error al copiar el JSON minificado')
        }
    }

    const handleDownload = () => {
        const blob = new Blob([jsonString], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'reporte_config.json'
        a.click()
        URL.revokeObjectURL(url)
    }

    return (
        <div className="p-6 bg-light-contrast dark:bg-dark-contrast text-text dark:text-text-dark rounded shadow mt-6 space-y-4">
            <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
            <h2 className="text-xl font-semibold text-secondary dark:text-secondary-dark">7. Vista previa del JSON</h2>

            <pre className="bg-light-check dark:bg-dark-check border border-gray-600 rounded p-4 overflow-x-auto max-h-[500px] text-sm">
                {jsonString}
            </pre>

            <div className="flex flex-wrap gap-4">
                <button
                    onClick={handleCopy}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                >
                    {copied ? '¡Copiado!' : 'Copiar JSON formateado'}
                </button>

                <button
                    onClick={handleCopyMinified}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
                >
                    {copiedMinified ? '¡Copiado!' : 'Copiar JSON minificado'}
                </button>

                <button
                    onClick={handleDownload}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                >
                    Descargar JSON
                </button>
            </div>
        </div>
    )
}
