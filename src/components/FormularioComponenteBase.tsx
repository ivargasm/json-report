import { useEffect, useState } from 'react'
import { useComponentsStore } from '../store/componentsStore'
import toast, { Toaster } from 'react-hot-toast'

export default function FormularioComponenteBase() {
    const {
        components,
        addComponent,
        updateComponent,
        setParsedColumns,
    } = useComponentsStore()

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

    const [editingId, setEditingId] = useState<string | null>(null)

    useEffect(() => {
        if (!editingId) return
        const existing = components.find((c) => c.id === editingId)
        if (existing) {
            setForm({
                id: existing.id,
                title: existing.title,
                type: existing.type,
                schema: existing.schema,
                datasource: existing.datasource,
                count_datasource: existing.count_datasource || '',
                last_date_datasource: existing.last_date_datasource || '',
                column_titles: existing.column_titles?.join(', ') || '',
            })
        }
    }, [editingId, components])

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleParseColumns = async () => {
        if (!form.datasource || !form.type || !form.id) return

        try {
            const res = await fetch('https://json-report-backend.onrender.com/columns/parse-columns', {
            // const res = await fetch('http://localhost:8000/columns/parse-columns', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    query: form.datasource,
                    component_type: form.type,
                }),
            })
            const data = await res.json()
            if (data.columns) {
                setParsedColumns(form.id, data.columns)
                toast.success('Columnas detectadas correctamente.')
            } else {
                toast.error('No se pudieron obtener las columnas. Por favor, retira los placeholders del query y vuelve a intentar. Luego puedes volver a cargar el query completo con placeholders.')
            }
        } catch (err) {
            console.error(err)
            toast.error('Ocurrió un error al conectar con el backend.')
        }
    }

    const handleAdd = () => {
        if (!form.id || !form.datasource) {
            toast.error('ID y datasource son obligatorios.')
            return
        }

        const base: any = {
            id: form.id,
            type: form.type as 'resume' | 'table',
            title: form.title,
            schema: form.schema as 'project' | 'stoiii' | 'stoiii_config',
            datasource: form.datasource,
            parsedColumns: [],
        }

        if (form.type === 'resume') {
            addComponent({
                ...base,
                last_date_datasource: form.last_date_datasource || '',
                column_titles: form.column_titles.split(',').map((s) => s.trim()),
                rows: [],
            })
        } else {
            addComponent({
                ...base,
                count_datasource: form.count_datasource || '',
                columns: [],
            })
        }

        toast.success('Componente agregado.')
        handleClear()
    }

    const handleUpdate = () => {
        const updates: any = {
            title: form.title,
            schema: form.schema,
            datasource: form.datasource,
        }

        if (form.type === 'resume') {
            updates.last_date_datasource = form.last_date_datasource || ''
            updates.column_titles = form.column_titles
                ? form.column_titles.split(',').map((t) => t.trim())
                : []
        } else {
            updates.count_datasource = form.count_datasource || ''
        }

        updateComponent(form.id, updates)
        toast.success('Componente actualizado.')
    }

    const handleClear = () => {
        setForm({
            id: '',
            title: '',
            type: 'resume',
            schema: 'project',
            datasource: '',
            count_datasource: '',
            last_date_datasource: '',
            column_titles: '',
        })
        setEditingId(null)
    }

    const isResume = form.type === 'resume'
    const exists = !!editingId

    return (
        <div className="p-6 bg-light-contrast dark:bg-dark-contrast rounded-lg shadow text-text dark:text-text-dark space-y-6 mt-6">
            <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
            <h2 className="text-xl font-semibold text-secondary dark:text-secondary-dark">4. Configurar componente</h2>

            {/* Listado de componentes existentes */}
            {components.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {components.map((c) => (
                        <button
                            key={c.id}
                            onClick={() => setEditingId(c.id)}
                            className={`px-3 py-1 rounded-full border text-sm transition cursor-pointer
                                ${editingId === c.id ? 'bg-blue-700 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'}`}
                        >
                            {c.id} ({c.type})
                        </button>
                    ))}
                </div>
            )}

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
                        className="bg-[#2b2b3d] border border-gray-600 p-2 rounded w-full"
                    >
                        <option value="resume">Resumen</option>
                        <option value="table">Tabla</option>
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
                        <label className="block text-sm mb-1">Column titles (separados por coma)</label>
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

            <div className="flex flex-wrap gap-4 pt-4">
                {exists ? (
                    <button
                        onClick={handleUpdate}
                        className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded"
                    >
                        Actualizar componente
                    </button>
                ) : (
                    <button
                        onClick={handleAdd}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                    >
                        Agregar nuevo componente
                    </button>
                )}

                <button
                    onClick={handleParseColumns}
                    disabled={!form.id}
                    className={`px-4 py-2 rounded ${!form.id ? 'bg-blue-800 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
                >
                    Obtener columnas
                </button>

                <button
                    onClick={handleClear}
                    className="bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded"
                >
                    Limpiar formulario
                </button>
            </div>
        </div>
    )
}
