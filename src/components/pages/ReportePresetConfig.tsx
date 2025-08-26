// src/App.tsx
import { Lightbulb, Database, AlertCircle } from 'lucide-react';
import { useConfigStore } from '../../store/configStore';
import { AVAILABLE_VARIABLES, DATASET_TYPES } from '../../constants';
import {
    Section,
    InputField,
    SelectField,
    ColumnCard,
    RadioCard,
    QueryTextarea,
    Spinner,
    VariableCard,
    CodeViewer
} from '../ui/ui-components';

export default function ReportePresetConfig() {

    // Obtenemos todo el store de Zustand
    const store = useConfigStore();


    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    const downloadFile = (content: string, fileName: string, contentType: string) => {
        const a = document.createElement("a");
        const file = new Blob([content], { type: contentType });
        a.href = URL.createObjectURL(file);
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(a.href);
    };


    return (
        <div className="min-h-screen bg-bg dark:bg-bg-dark text-text dark:text-text-dark transition-colors duration-300">
            <div className="container mx-auto p-4 md:p-8 md:max-w-3xl lg:max-w-4xl xl:max-w-5xl">
                <header className="mb-8 flex justify-between items-start">
                    <div>
                        <h1 className="text-4xl font-bold text-primary dark:text-primary-dark">Generador de Configuración Preset</h1>
                        <p className="text-text dark:text-text-dark mt-2">Construye archivos de configuración de forma intuitiva.</p>
                    </div>
                </header>

                <main className="grid grid-cols-1 gap-8">
                    {/* --- Sección 1: Entradas Principales --- */}
                    <Section title="1. Entradas Principales">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InputField label="Nombre del Reporte" value={store.reportName} onChange={e => store.setReportName(e.target.value)} placeholder="ej: exhibition" />
                            <InputField label="Nombre del Proyecto" value={store.projectName} onChange={e => store.setProjectName(e.target.value)} placeholder="ej: project9519" />
                            <SelectField
                                label="Tipo de Configuración"
                                value={store.configType}
                                onChange={e => store.setConfigType(e.target.value as 'adhoc' | 'preset')}
                            >
                                <option value="adhoc">Adhoc</option>
                                <option value="preset">Preset</option>
                            </SelectField>
                            <SelectField
                                label="Tipo de JSON"
                                value={store.jsonType}
                                onChange={e => store.setJsonType(e.target.value as 'normal' | 'groupBy')}
                            >
                                <option value="normal">JSON Normal</option>
                                <option value="groupBy">JSON GroupBy</option>
                            </SelectField>
                        </div>
                        <div className="mt-6">
                            <label htmlFor="main-sql" className="block text-sm font-medium text-text dark:text-text-dark mb-2">Consulta SQL Principal</label>
                            <textarea id="main-sql" rows={8} className="w-full p-3 bg-light-check dark:bg-dark-check border border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-primary focus:border-primary font-mono text-sm text-text dark:text-text-dark" value={store.mainSql} onChange={e => store.setMainSql(e.target.value)} />
                            <button onClick={store.analyzeSql} disabled={store.isAnalyzing} className="mt-4 inline-flex items-center justify-center px-6 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-btn dark:bg-btn-dark hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed">
                                {store.isAnalyzing ? <><Spinner /> Analizando...</> : 'Analizar SQL y Extraer Columnas'}
                            </button>
                            {store.analysisError && (
                                <div className="mt-4 p-4 bg-light-contrast dark:bg-dark-contrast border-l-4 border-red-400 dark:border-red-600 text-red-800 dark:text-red-300 rounded-r-lg" role="alert">
                                    <div className="flex">
                                        <div className="py-1"><AlertCircle className="h-5 w-5 text-red-500 dark:text-red-400 mr-3" /></div>
                                        <div>
                                            <p className="font-bold">Error en el Análisis</p>
                                            <p className="text-sm">{store.analysisError}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </Section>

                    {/* --- Sección 2: Configuración de Columnas (condicional) --- */}
                    {store.columns.length > 0 && (
                        <Section title="2. Configuración de Columnas">
                            <div className="space-y-4 max-h-[600px] overflow-y-auto custom-scroll">
                                {store.columns.map((col, index) => (
                                    <ColumnCard key={index} column={col} index={index} jsonType="normal" onDataTypeChange={store.handleDataTypeChange} onCustomMessageChange={store.handleCustomMessageChange} />
                                ))}
                            </div>
                        </Section>
                    )}

                    {/* --- Secciones 3 y 4 --- */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <Section title="3. Selección de Variables (Opcional)">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-[400px] overflow-y-auto">
                                {AVAILABLE_VARIABLES.map(variable => {
                                    const isSelected = store.selectedVariables[variable.var] !== undefined;
                                    const alias = store.selectedVariables[variable.var] || '';
                                    return (
                                        <VariableCard
                                            key={variable.var}
                                            variable={variable}
                                            isSelected={isSelected}
                                            alias={alias}
                                            onToggle={() => store.handleVariableToggle(variable.var)}
                                            onAliasChange={(e) => store.handleAliasChange(variable.var, e.target.value)}
                                        />
                                    );
                                })}
                            </div>
                        </Section>
                        <Section title="4. Selección de Tipo de Dataset (Obligatorio)">
                            <div className=" grid grid-cols-1 md:grid-cols-2 gap-4">
                                {DATASET_TYPES.map(type => (
                                    <RadioCard key={type.id} id={`type-${type.id}`} name="datasetType" label={type.dsci18n.split('.').pop()!.replace(/^\w/, c => c.toUpperCase())} description={type.description} checked={store.selectedDatasetType === type.id} onChange={() => store.setSelectedDatasetType(type.id)} />
                                ))}
                            </div>
                        </Section>
                    </div>

                    {/* --- Sección 5 --- */}
                    <Section title="5. Consultas Adicionales (Opcional)">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <QueryTextarea id="pre-queries" label="Pre-Queries (separadas por ';')" value={store.preQueries} onChange={e => store.setPreQueries(e.target.value)} />
                            <QueryTextarea id="post-queries" label="Post-Queries (separadas por ';')" value={store.postQueries} onChange={e => store.setPostQueries(e.target.value)} />
                        </div>
                    </Section>

                    {/* --- Sección 6: Botón de Generación --- */}
                    <Section title="6. Generación de Outputs">
                        <button onClick={store.generateOutputs} disabled={store.columns.length === 0} className="w-full md:w-auto inline-flex items-center justify-center px-8 py-3 border border-transparent text-lg font-medium rounded-md shadow-sm text-white bg-secondary dark:bg-secondary-dark hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary disabled:opacity-50 disabled:cursor-not-allowed">
                            <Database className="mr-3 h-6 w-6" />
                            Generar JSON y Script SQL
                        </button>
                    </Section>

                    {store.generatedJson && (
                        <Section title="Resultados Generados">
                            <div className="space-y-8">
                                <CodeViewer
                                    title="config.json"
                                    code={store.generatedJson}
                                    onCopy={() => handleCopy(store.generatedJson)}
                                    onCopyMinified={() => handleCopy(store.generatedJsonMinified)}
                                    onDownload={() => downloadFile(store.generatedJson, 'config.json', 'application/json')}
                                    fileName="config.json"
                                />
                                <CodeViewer
                                    title="i18n.sql"
                                    code={store.generatedSql}
                                    onCopy={() => handleCopy(store.generatedSql)}
                                    onDownload={() => downloadFile(store.generatedSql, 'i18n.sql', 'text/sql')}
                                    fileName="i18n.sql"
                                />
                            </div>
                        </Section>
                    )}

                    {/* Mensaje de Siguientes Pasos (condicional) */}
                    {store.columns.length === 0 && !store.generatedJson && (
                        <div className="mt-6 p-4 bg-light-contrast dark:bg-dark-contrast border-l-4 border-blue-400 dark:border-blue-600 text-blue-800 dark:text-blue-300 rounded-r-lg">
                            <div className="flex">
                                <div className="py-1"><Lightbulb className="h-5 w-5 text-accent dark:text-accent-dark mr-3" /></div>
                                <div>
                                    <p className="font-bold">Siguientes pasos</p>
                                    <p className="text-sm">Introduce tu consulta SQL y haz clic en "Analizar SQL" para empezar.</p>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
