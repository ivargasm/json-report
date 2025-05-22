import { useState } from 'react'
import { useComponentsStore } from '../store/componentsStore'

export default function FormularioComponenteBase() {
    const { table, resume, setComponent, setParsedColumns } = useComponentsStore()
    const [form, setForm] = useState({
        id: '',
        title: '',
        type: 'resume',
        schema: 'project',
        datasource: '',
        count_datasource: '',
        last_date_datasource: '',
        column_titles: '',
    })

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleParseColumns = async () => {
        if (!form.datasource || !form.type) return

        try {
            const res = await fetch('http://127.0.0.1:8000/columns/parse-columns', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    query: form.datasource,
                    component_type: form.type,
                }),
            })
            const data = await res.json()
            if (data.columns) {
                setParsedColumns(form.type as 'resume' | 'table', data.columns)
                alert('Columnas detectadas correctamente.')
            } else {
                alert('Error al obtener columnas.')
            }
        } catch (err) {
            console.error(err)
            alert('Ocurrió un error al conectar con el backend.')
        }
    }

    const handleAdd = () => {
        if (!form.id || !form.datasource) {
            alert('ID y datasource son obligatorios.')
            return
        }

        if (form.type === 'resume' && resume) {
            alert('Ya existe un componente de tipo resumen.')
            return
        }

        if (form.type === 'table' && table?.datasource) {
            alert('Ya existe un componente de tipo tabla.')
            return
        }

        const baseProps = {
            id: form.id,
            type: form.type as 'resume' | 'table',
            title: form.title,
            schema: form.schema as 'project' | 'stoiii' | 'stoiii_config',
            datasource: form.datasource,
            parsedColumns: [],
        }

        const component =
            form.type === 'resume'
                ? {
                    ...baseProps,
                    last_date_datasource: form.last_date_datasource || '',
                    column_titles: form.column_titles
                        ? form.column_titles.split(',').map((t) => t.trim())
                        : [],
                    rows: [],
                }
                : {
                    ...baseProps,
                    count_datasource: form.count_datasource || '',
                    columns: [],
                }

        setComponent(component)
        alert(`Componente "${form.type}" agregado.`)
    }


    const isResume = form.type === 'resume'

    return (
        <div className="p-6 bg-light-contrast dark:bg-dark-contrast rounded-lg shadow text-text dark:text-text-dark space-y-6 mt-6">
            <h2 className="text-xl font-semibold text-secondary dark:text-secondary-dark">4. Agregar componente</h2>

            <div className="grid md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm mb-1">ID</label>
                    <input
                        name="id"
                        value={form.id}
                        onChange={handleChange}
                        className="bg-light-check dark:bg-dark-check border border-gray-600 p-2 rounded w-full"
                        placeholder="Ej: sales_resume"
                    />
                </div>

                <div>
                    <label className="block text-sm mb-1">Título</label>
                    <input
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        className="bg-light-check dark:bg-dark-check border border-gray-600 p-2 rounded w-full"
                        placeholder="Título visible"
                    />
                </div>

                <div>
                    <label className="block text-sm mb-1">Tipo</label>
                    <select
                        name="type"
                        value={form.type}
                        onChange={handleChange}
                        className="bg-light-check dark:bg-dark-check border border-gray-600 p-2 rounded w-full"
                    >
                        <option value="resume" disabled={!!resume}>
                            Resumen
                        </option>
                        <option value="table" disabled={!!table?.datasource}>
                            Tabla
                        </option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm mb-1">Schema</label>
                    <select
                        name="schema"
                        value={form.schema}
                        onChange={handleChange}
                        className="bg-light-check dark:bg-dark-check border border-gray-600 p-2 rounded w-full"
                    >
                        <option value="project">project</option>
                        <option value="stoiii">stoiii</option>
                        <option value="stoiii_config">stoiii_config</option>
                    </select>
                </div>
            </div>

            <div>
                <label className="block text-sm mb-1">Datasource</label>
                <textarea
                    name="datasource"
                    value={form.datasource}
                    onChange={handleChange}
                    className="bg-light-check dark:bg-dark-check border border-gray-600 p-2 rounded w-full"
                    rows={4}
                />
            </div>

            {isResume ? (
                <>
                    <div>
                        <label className="block text-sm mb-1">last_date_datasource</label>
                        <input
                            name="last_date_datasource"
                            value={form.last_date_datasource}
                            onChange={handleChange}
                            className="bg-light-check dark:bg-dark-check border border-gray-600 p-2 rounded w-full"
                        />
                    </div>

                    <div>
                        <label className="block text-sm mb-1">
                            Column titles (separados por coma)
                        </label>
                        <input
                            name="column_titles"
                            value={form.column_titles}
                            onChange={handleChange}
                            className="bg-light-check dark:bg-dark-check border border-gray-600 p-2 rounded w-full"
                            placeholder="Ej: Kg, Monto"
                        />
                    </div>
                </>
            ) : (
                <div>
                    <label className="block text-sm mb-1">count_datasource</label>
                    <input
                        name="count_datasource"
                        value={form.count_datasource}
                        onChange={handleChange}
                        className="bg-light-check dark:bg-dark-check border border-gray-600 p-2 rounded w-full"
                    />
                </div>
            )}

            <div className="flex space-x-4 pt-4">
                <button
                    onClick={handleAdd}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                >
                    Agregar componente
                </button>

                <button
                    onClick={handleParseColumns}
                    disabled={
                        (form.type === 'resume' && !resume) ||
                        (form.type === 'table' && !table?.datasource)
                    }
                    className={`px-4 py-2 rounded ${(form.type === 'resume' && !resume) || (form.type === 'table' && !table?.datasource)
                        ? 'bg-blue-800 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700'
                        } text-white`}
                >
                    Obtener columnas
                </button>

            </div>
        </div>
    )
}
