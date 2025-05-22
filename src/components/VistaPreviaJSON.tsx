import { useFiltersStore } from '../store/filtersStore'
import { ReportComponent, useComponentsStore } from '../store/componentsStore'
import { useState } from 'react'

export default function VistaPreviaJSON() {
    const { filters, generic_filters, filters_properties } = useFiltersStore()
    const { table, resume } = useComponentsStore()
    const [copied, setCopied] = useState(false)

    const cleanComponent = (comp: ReportComponent): ReportComponent => {
        const { parsedColumns, ...rest } = comp
        return rest
    }

    const jsonFinal = {
        filters,
        ...(generic_filters.length > 0 && { generic_filters }),
        ...(Object.keys(filters_properties).length > 0 && { filters_properties }),
        components: [resume, table]
            .filter((comp): comp is ReportComponent => !!comp)
            .map(cleanComponent),
    }


    const jsonString = JSON.stringify(jsonFinal, null, 2)

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(jsonString)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            alert('Error al copiar')
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
            <h2 className="text-xl font-semibold text-secondary dark:text-secondary-dark">7. Vista previa del JSON</h2>

            <pre className="bg-light-check dark:bg-dark-check border border-gray-600 rounded p-4 overflow-x-auto max-h-[500px] text-sm">
                {jsonString}
            </pre>

            <div className="flex space-x-4">
                <button
                    onClick={handleCopy}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                >
                    {copied ? '¡Copiado!' : 'Copiar al portapapeles'}
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
