import { useState } from 'react'
import { FilterSelector, GenericFiltersForm, DefaultFilterProperties, FormularioComponenteBase } from '../forms';
import {
    ComponentTableConfigurator, ComponentResumeConfigurator, ComponentBasicCardConfigurator,
    ComponentProgressBarConfigurator, ComponentBasicTreeConfigurator, ComponentGraphConfigurator
} from '../configurators';
import { VistaPreviaJSON } from '../ui';
import { useComponentsStore } from '../../store/componentsStore'
import { useFiltersStore } from '../../store/filtersStore'
import toast, { Toaster } from 'react-hot-toast'
import { Settings, Plus, LayoutList, HardDriveUpload, Smartphone } from 'lucide-react'

export default function ReporteConfigPage() {
    const { components, clear: resetComponents, loadFromJSON: loadComponents, removeComponent } = useComponentsStore()
    const { reset: resetFilters, loadFromJSON: loadFilters } = useFiltersStore()

    const [activeTab, setActiveTab] = useState('general')

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
                setActiveTab('general')
            } catch {
                toast.error('Error al leer el JSON.')
            }
        }
        reader.readAsText(file)
    }

    const handleDeleteComponent = (id: string) => {
        toast((t) => (
            <div className="flex flex-col gap-3">
                <p className="font-semibold text-sm">¿Eliminar componente {id}?</p>
                <div className="flex gap-2">
                    <button onClick={() => { removeComponent(id); if (activeTab === id) setActiveTab('general'); toast.dismiss(t.id); }} className="bg-red-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold">Sí, eliminar</button>
                    <button onClick={() => toast.dismiss(t.id)} className="bg-gray-100 dark:bg-dark-check px-3 py-1.5 rounded-lg text-xs font-bold">Cancelar</button>
                </div>
            </div>
        ), { duration: 5000 });
    }

    const renderMainContent = () => {
        if (activeTab === 'general') {
            return (
                <div className="space-y-6 animate-in fade-in duration-500 pb-12">
                    <div className="bg-light-contrast dark:bg-dark-contrast p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-dark-check">
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold flex items-center gap-3 text-text dark:text-text-dark"><Settings className="text-primary" /> Filtros Globales</h2>
                            <p className="text-gray-500 text-sm mt-1">Define los selectores y propiedades maestras para este reporte.</p>
                        </div>
                        <div className="space-y-8">
                            <FilterSelector />
                            <GenericFiltersForm />
                            <DefaultFilterProperties />
                        </div>
                    </div>
                </div>
            )
        }
        if (activeTab === 'add_component') {
            return (
                <div className="animate-in fade-in duration-500 pb-12">
                    <FormularioComponenteBase onAdded={(id) => setActiveTab(id)} />
                </div>
            )
        }

        const comp = components.find(c => c.id === activeTab)
        if (!comp) return null

        return (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12" key={comp.id}>
                {/* Visual Architect "Data Query Engine" Block */}
                <div className="relative">
                    <FormularioComponenteBase componentId={comp.id} onDelete={() => handleDeleteComponent(comp.id)} />
                </div>

                {/* Sub-Widgets area mimicking the 3-cards below the editor */}
                <div className="bg-light-contrast dark:bg-dark-contrast p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-dark-check mt-6">
                    <div className="mb-6 flex items-center gap-3">
                        <div className="p-2.5 bg-primary/10 rounded-xl text-primary"><LayoutList size={22} /></div>
                        <div>
                            <h3 className="text-xl font-bold text-text dark:text-text-dark">Configuración Específica</h3>
                            <p className="text-sm font-medium text-gray-500 mt-0.5">Parámetros visuales del {comp.type}</p>
                        </div>
                    </div>

                    <div className="bg-bg dark:bg-bg-dark p-6 rounded-2xl border border-gray-100 dark:border-dark-check">
                        {comp.type === 'resume' && <ComponentResumeConfigurator componentId={comp.id} />}
                        {comp.type === 'table' && <ComponentTableConfigurator componentId={comp.id} />}
                        {comp.type === 'basic_card' && <ComponentBasicCardConfigurator componentId={comp.id} />}
                        {comp.type === 'progress_bar' && <ComponentProgressBarConfigurator componentId={comp.id} />}
                        {comp.type === 'basic_tree' && <ComponentBasicTreeConfigurator componentId={comp.id} />}
                        {comp.type.startsWith('graph_') && <ComponentGraphConfigurator componentId={comp.id} />}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-bg dark:bg-bg-dark flex font-sans selection:bg-primary/20 dark:selection:bg-primary-dark/30">
            <Toaster position="top-right" toastOptions={{ duration: 3000, className: 'rounded-2xl shadow-lg font-medium' }} />

            {/* Visual Architect Thin/Clean Sidebar */}
            <aside className="w-20 md:w-64 flex-shrink-0 bg-light-contrast dark:bg-dark-contrast border-r border-gray-100 dark:border-dark-check flex flex-col h-screen sticky top-0 z-20 transition-all shadow-sm">
                <div className="p-6 md:p-8 flex items-center gap-4 justify-center md:justify-start">
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/30 flex-shrink-0">
                        <span className="text-white font-bold text-xl leading-none">R</span>
                    </div>
                    <span className="font-extrabold text-xl tracking-tight hidden md:block text-text dark:text-text-dark">Builder</span>
                </div>

                <div className="flex-1 overflow-y-auto px-3 md:px-5 py-6 space-y-8 scrollbar-hidden">
                    <div className="space-y-2">
                        <div className="px-2 mb-4 hidden md:block">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Base</span>
                        </div>
                        <button onClick={() => setActiveTab('general')} className={`w-full flex items-center justify-center md:justify-start gap-4 px-3 md:px-4 py-3 md:py-3.5 rounded-2xl text-[13px] font-bold transition-all duration-200 group ${activeTab === 'general' ? 'bg-primary/10 text-primary shadow-inner shadow-primary/5' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-dark-check/50 hover:text-text dark:hover:text-text-dark'}`}>
                            <Settings size={20} className={`${activeTab === 'general' ? 'text-primary' : 'text-gray-400 group-hover:text-primary/70'} transition-all`} />
                            <span className="hidden md:block">Filtros Globales</span>
                        </button>
                    </div>

                    <div>
                        <div className="px-2 mb-4 flex items-center justify-between md:flex">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Componentes</span>
                            <span className="bg-gray-100 dark:bg-dark-check text-gray-500 dark:text-gray-300 px-2 py-0.5 rounded-full text-[10px] font-bold">{components.length}</span>
                        </div>
                        <div className="space-y-2">
                            {components.map(c => (
                                <button key={c.id} onClick={() => setActiveTab(c.id)} className={`relative w-full flex items-center justify-center md:justify-start gap-3 px-3 md:px-4 py-3 rounded-2xl text-[13px] font-bold transition-all duration-200 group ${activeTab === c.id ? 'bg-light-contrast dark:bg-dark-contrast text-text dark:text-text-dark shadow-sm ring-1 ring-gray-200 dark:ring-dark-check' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-dark-check/50 hover:text-text dark:hover:text-text-dark'}`}>
                                    {activeTab === c.id && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full" />}
                                    <div className={`p-1.5 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${activeTab === c.id ? 'bg-primary/10 text-primary' : 'bg-gray-100 dark:bg-dark-check text-gray-400'}`}>
                                        <LayoutList size={14} strokeWidth={2.5} />
                                    </div>
                                    <span className="truncate hidden md:block">{c.id}</span>
                                </button>
                            ))}
                            <button onClick={() => setActiveTab('add_component')} className="w-full flex items-center justify-center md:justify-start gap-3 px-3 md:px-5 py-3 md:py-3.5 mt-6 rounded-2xl text-[13px] font-extrabold text-primary bg-primary/5 hover:bg-primary/10 transition-all border border-dashed border-primary/20 hover:border-primary/40">
                                <Plus size={18} strokeWidth={2.5} /> <span className="hidden md:block uppercase tracking-wider text-[11px]">Nuevo Componente</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="p-4 md:p-6 border-t border-gray-100 dark:border-dark-check space-y-3">
                    <label className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-bold text-text dark:text-text-dark bg-light-contrast dark:bg-dark-contrast hover:bg-gray-50 dark:hover:bg-dark-check/50 cursor-pointer transition-all shadow-sm border border-gray-200 dark:border-dark-check active:scale-[0.98]">
                        <HardDriveUpload size={16} className="text-gray-400" /> <span className="hidden md:block">Importar</span>
                        <input type="file" accept=".json" onChange={handleCargarJSON} className="hidden" />
                    </label>
                </div>
            </aside>

            {/* Main Application Area */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden relative">

                {/* Top Navbar emulating Visual Architect Header */}
                <header className="h-20 bg-light-contrast dark:bg-dark-contrast border-b border-gray-100 dark:border-dark-check px-8 md:px-12 flex items-center justify-between sticky top-0 z-10">
                    <div className="flex items-center gap-8">
                        <h1 className="text-xl font-bold tracking-tight text-text dark:text-text-dark opacity-0 md:opacity-100 transition-opacity">
                            {activeTab === 'general' ? 'Dashboard' : activeTab === 'add_component' ? 'Nuevo Componente' : `Componente: ${activeTab}`}
                        </h1>
                        <nav className="hidden lg:flex items-center gap-6">
                            <span className="text-sm font-semibold border-b-2 border-primary text-primary pb-1">Configuración</span>
                            <span className="text-sm font-semibold text-gray-400 hover:text-text transition-colors cursor-pointer">Esquema</span>
                        </nav>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="hidden lg:flex items-center gap-2 px-4 py-1.5 bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 rounded-full text-[11px] font-bold uppercase tracking-widest border border-green-200 dark:border-green-500/20">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            Live Sync
                        </div>
                        <button onClick={() => {
                            toast((t) => (
                                <div className="flex flex-col gap-3">
                                    <p className="font-semibold text-sm">¿Limpiar TODA la configuración?</p>
                                    <div className="flex gap-2">
                                        <button onClick={() => { resetComponents(); resetFilters(); setActiveTab('general'); toast.dismiss(t.id); }} className="bg-red-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold">Sí, limpiar</button>
                                        <button onClick={() => toast.dismiss(t.id)} className="bg-gray-100 dark:bg-dark-check px-3 py-1.5 rounded-lg text-xs font-bold">Cancelar</button>
                                    </div>
                                </div>
                            ), { duration: 5000 });
                        }} className="px-4 py-2.5 rounded-xl text-xs font-bold text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all uppercase tracking-wider">
                            Resetear
                        </button>
                    </div>
                </header>

                {/* 2-Column Split: Content & JSON Preview (the "Phone" mockup) */}
                <div className="flex-1 flex overflow-hidden">
                    <div className="flex-1 overflow-y-auto px-6 py-8 md:px-12 md:py-10">
                        <div className="max-w-4xl mx-auto">
                            {renderMainContent()}
                        </div>
                    </div>

                    {/* The Right Sidebar: JSON Code Output simulating the phone context */}
                    <div className="hidden xl:flex w-[450px] bg-[#f8fafc] border-l border-gray-200 flex-col shadow-[-10px_0_30px_-15px_rgba(0,0,0,0.05)] z-10 text-slate-900">
                        <div className="h-20 flex items-center px-6 border-b border-gray-200 shrink-0 bg-white">
                            <h2 className="text-sm font-extrabold uppercase tracking-widest text-slate-900 flex items-center gap-2">
                                <Smartphone size={18} className="text-primary" /> Visual Output
                            </h2>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6 bg-[#f1f5f9]">
                            {/* Floating Card for Code mimicking the phone frame heavily rounded */}
                            <div className="bg-white rounded-[2.5rem] shadow-xl border-8 border-gray-200 overflow-hidden min-h-[600px] flex flex-col relative text-slate-900">
                                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-6 bg-gray-200 rounded-full z-20 hidden md:block" />
                                <div className="pt-14 pb-8 flex-1 overflow-y-auto scrollbar-hidden">
                                    <VistaPreviaJSON />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
