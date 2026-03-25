import { useEffect, useState } from 'react'
import { useComponentsStore } from '../../store/componentsStore'
import { API_CONFIG } from '../../config'
import toast, { Toaster } from 'react-hot-toast'
import { Database, Play, Code2 } from 'lucide-react'

export default function FormularioComponenteBase({
    componentId,
    onAdded,
    onDelete
}: {
    componentId?: string,
    onAdded?: (id: string) => void,
    onDelete?: () => void
}) {
    const { components, addComponent, updateComponent, setParsedColumns } = useComponentsStore()

    const [form, setForm] = useState({
        id: '', title: '', type: 'resume', schema: 'project',
        datasource: '', count_datasource: '', last_date_datasource: '', column_titles: '',
    })

    useEffect(() => {
        if (!componentId) {
            setForm({
                id: '', title: '', type: 'resume', schema: 'project',
                datasource: '', count_datasource: '', last_date_datasource: '', column_titles: '',
            })
            return
        }
        const existing = components.find((c) => c.id === componentId)
        if (existing) {
            setForm({
                id: existing.id, title: existing.title, type: existing.type, schema: existing.schema,
                datasource: existing.datasource, count_datasource: existing.count_datasource || '',
                last_date_datasource: existing.last_date_datasource || '',
                column_titles: existing.column_titles?.join(', ') || '',
            })
        }
    }, [componentId, components])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleParseColumns = async () => {
        if (!form.datasource || !form.type || !form.id) return
        if (isNew) {
            toast.error('Primero agrega el componente de forma local.');
            return
        }
        try {
            const res = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.MOBILE}`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: form.datasource, component_type: form.type }),
            })
            const data = await res.json()
            if (data.columns) {
                setParsedColumns(form.id, data.columns)
                toast.success('Consultado al motor exitosamente.')
            } else {
                toast.error('No se encontraron columnas.')
            }
        } catch (err) {
            console.error(err)
            toast.error('Error de conexión con el motor SQL.')
        }
    }

    const handleAdd = () => {
        if (!form.id || !form.datasource) {
            toast.error('ID y Query SQL son obligatorios.')
            return
        }
        if (components.some(c => c.id === form.id)) {
            toast.error('Ya existe un bloque con ese ID.')
            return
        }

        const base = {
            id: form.id, type: form.type as any, title: form.title,
            schema: form.schema, datasource: form.datasource, parsedColumns: [],
        }

        if (form.type === 'resume') {
            addComponent({ ...base, last_date_datasource: form.last_date_datasource || '', column_titles: form.column_titles ? form.column_titles.split(',').map((s) => s.trim()) : [], rows: [] })
        } else if (form.type === 'table') {
            addComponent({ ...base, count_datasource: form.count_datasource || '', columns: [] })
        } else if (form.type === 'basic_card') {
            addComponent({ ...base, descriptions: [] })
        } else if (form.type === 'progress_bar') {
            addComponent({ ...base })
        } else if (form.type === 'basic_tree') {
            addComponent({ ...base, tree: { root_column: '', root_value: null, dsc_column: '', children: null }, columns: [], treeColumns: [] })
        } else if (form.type.startsWith('graph_')) {
            addComponent({ ...base, random_colors: 'false', last_date_datasource: form.last_date_datasource || '' })
        }
        toast.success('Motor configurado.')
        if (onAdded) onAdded(form.id)
    }

    const handleUpdate = () => {
        const updates: any = { title: form.title, schema: form.schema, datasource: form.datasource }
        if (form.type === 'resume') {
            updates.last_date_datasource = form.last_date_datasource || ''
            updates.column_titles = form.column_titles ? form.column_titles.split(',').map((t) => t.trim()) : []
        } else if (form.type === 'table') {
            updates.count_datasource = form.count_datasource || ''
        } else if (form.type.startsWith('graph_')) {
            updates.last_date_datasource = form.last_date_datasource || ''
        }
        updateComponent(form.id, updates)
        toast.success('Engine Settings Synced.')
    }

    const isNew = !componentId
    const requiresLastDate = ['resume', 'graph_bar', 'graph_pie', 'graph_doughnut', 'graph_line', 'graph_mixed'].includes(form.type)
    const requiresCount = form.type === 'table'

    return (
        <div className="bg-light-contrast dark:bg-dark-contrast rounded-3xl border border-gray-100 dark:border-dark-check shadow-sm overflow-hidden flex flex-col">
            <Toaster position="top-right" toastOptions={{ className: 'font-semibold text-sm rounded-2xl' }} />

            {/* Minimal Header */}
            <div className="px-8 py-6 border-b border-gray-100 dark:border-dark-check flex items-center justify-between bg-bg/50 dark:bg-bg-dark/20">
                <div className="flex items-center gap-3">
                    <Database className="text-primary" size={24} />
                    <h2 className="text-2xl font-black text-text dark:text-text-dark tracking-tight">
                        {isNew ? 'Data Query Engine' : `Engine: ${form.id}`}
                    </h2>
                </div>
                {!isNew && (
                    <div className="flex gap-3">
                        <button onClick={handleUpdate} className="bg-light-check dark:bg-dark-check text-text dark:text-text-dark hover:bg-gray-200 dark:hover:bg-gray-700 px-5 py-2.5 rounded-full font-bold text-sm transition-all flex items-center gap-2">
                            <Code2 size={16} /> Update Schema
                        </button>
                        {onDelete && (
                            <button onClick={onDelete} className="bg-red-50 dark:bg-red-500/10 text-red-500 hover:bg-red-100 dark:hover:bg-red-500/20 px-4 py-2.5 rounded-full font-bold text-sm transition-all flex items-center gap-2">
                                Eliminar
                            </button>
                        )}
                    </div>
                )}
            </div>

            <div className="p-8 space-y-8">
                {/* Meta Inputs row */}
                <div className="grid md:grid-cols-4 gap-6">
                    <div className="col-span-1">
                        <label className="block text-[11px] font-extrabold uppercase tracking-widest mb-2 text-gray-500">Component ID</label>
                        <input name="id" value={form.id} onChange={handleChange} disabled={!isNew}
                            className="w-full bg-light-check dark:bg-dark-check border-none rounded-xl px-4 py-3 font-semibold text-text dark:text-text-dark focus:ring-2 focus:ring-primary/50 outline-none transition-all disabled:opacity-50"
                            placeholder="sales_resume"
                        />
                    </div>
                    <div className="col-span-1">
                        <label className="block text-[11px] font-extrabold uppercase tracking-widest mb-2 text-gray-500">Schema</label>
                        <input name="schema" value={form.schema} onChange={handleChange}
                            className="w-full bg-light-check dark:bg-dark-check border-none rounded-xl px-4 py-3 font-semibold text-text dark:text-text-dark focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                            placeholder="project"
                        />
                    </div>
                    <div className="col-span-1">
                        <label className="block text-[11px] font-extrabold uppercase tracking-widest mb-2 text-gray-500">Tipo</label>
                        <select name="type" value={form.type} onChange={handleChange} disabled={!isNew}
                            className="w-full bg-light-check dark:bg-dark-check border-none rounded-xl px-4 py-3 font-semibold text-text dark:text-text-dark focus:ring-2 focus:ring-primary/50 outline-none transition-all disabled:opacity-50 cursor-pointer"
                        >
                            <option value="resume">Resumen</option>
                            <option value="table">Tabla</option>
                            <option value="basic_card">Basic Card</option>
                            <option value="progress_bar">Progress Bar</option>
                            <option value="basic_tree">Basic Tree</option>
                            <option value="graph_bar">Bar Chart</option>
                            <option value="graph_pie">Pie Chart</option>
                            <option value="graph_doughnut">Donut Widget</option>
                            <option value="graph_line">Line Graph</option>
                            <option value="graph_mixed">Mixed Chart</option>
                        </select>
                    </div>
                    <div className="col-span-1">
                        <label className="block text-[11px] font-extrabold uppercase tracking-widest mb-2 text-gray-500">Título Visual</label>
                        <input name="title" value={form.title} onChange={handleChange}
                            className="w-full bg-light-check dark:bg-dark-check border-none rounded-xl px-4 py-3 font-semibold text-text dark:text-text-dark focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                        />
                    </div>
                </div>

                {/* The "Data Query Engine" deep SQL block exact replica from Mockup */}
                <div className="bg-[#0f172a] rounded-2xl shadow-xl overflow-hidden border border-slate-700/50 flex flex-col">
                    <div className="flex items-center justify-between px-6 py-3 border-b border-slate-800/80 bg-[#1e293b]/50 backdrop-blur-md rounded-2xl">
                        <div className="flex items-center gap-3">
                            <Code2 size={16} className="text-blue-400" />
                            <span className="text-slate-300 text-sm font-semibold tracking-wide">Query Definition</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="px-2 py-0.5 bg-slate-800 text-slate-400 rounded text-[10px] font-bold tracking-widest hidden sm:block">POSTGRESQL</span>
                            <button onClick={handleParseColumns} disabled={!form.id || isNew} className="text-blue-400 hover:text-blue-300 text-xs font-bold flex items-center gap-1 transition-colors disabled:opacity-50">
                                Run Query <Play size={14} className="fill-current" />
                            </button>
                        </div>
                    </div>
                    <div className="relative font-mono text-[13px] sm:text-sm flex-1 flex">
                        <textarea name="datasource" value={form.datasource} onChange={handleChange}
                            className="w-full bg-[#0f172a] text-blue-100 p-5 outline-none resize-y leading-relaxed min-h-[160px] rounded-b-2xl border-none focus:ring-0"
                            spellCheck="false"
                            placeholder="SELECT date_trunc('day', created_at) AS day..."
                        />
                    </div>
                </div>

                {/* Optional secondary queries */}
                {(requiresLastDate || requiresCount || form.type === 'resume') && (
                    <div className="grid md:grid-cols-2 gap-6 pb-2">
                        {requiresLastDate && (
                            <div>
                                <label className="block text-[11px] font-extrabold uppercase tracking-widest mb-2 text-gray-500 shrink-0">SubQuery: Last Update</label>
                                <div className="bg-[#0f172a] rounded-xl overflow-hidden border border-slate-700/50 p-1">
                                    <input name="last_date_datasource" value={form.last_date_datasource} onChange={handleChange}
                                        className="w-full bg-transparent border-none px-4 py-2 font-mono text-[13px] text-blue-200 outline-none"
                                        placeholder="SELECT to_char(MAX(date)...)"
                                    />
                                </div>
                            </div>
                        )}
                        {requiresCount && (
                            <div>
                                <label className="block text-[11px] font-extrabold uppercase tracking-widest mb-2 text-gray-500 shrink-0">SubQuery: Count Pagination</label>
                                <div className="bg-[#0f172a] rounded-xl overflow-hidden border border-slate-700/50 p-1">
                                    <input name="count_datasource" value={form.count_datasource} onChange={handleChange}
                                        className="w-full bg-transparent border-none px-4 py-2 font-mono text-[13px] text-blue-200 outline-none"
                                        placeholder="SELECT COUNT(*)..."
                                    />
                                </div>
                            </div>
                        )}
                        {form.type === 'resume' && (
                            <div>
                                <label className="block text-[11px] font-extrabold uppercase tracking-widest mb-2 text-gray-500">Títulos de Columnas</label>
                                <input name="column_titles" value={form.column_titles} onChange={handleChange}
                                    className="w-full bg-light-check dark:bg-dark-check border-none rounded-xl px-4 py-3 font-semibold text-text dark:text-text-dark focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                                    placeholder="Ej: Kg, Monto, % Cumpl"
                                />
                            </div>
                        )}
                    </div>
                )}

                {isNew && (
                    <div className="pt-4 border-t border-gray-100 dark:border-dark-check">
                        <button onClick={handleAdd} className="w-full bg-primary hover:opacity-90 text-white py-4 rounded-xl font-bold transition-all shadow-lg shadow-primary/20 flex justify-center items-center gap-2">
                            Build Component <Database size={18} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
