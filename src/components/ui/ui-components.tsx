// src/components/ui-components.tsx
import React from 'react';
import { useState } from 'react';
import type { Column, Variable } from '../../types';
import { DATA_TYPES } from '../../constants';
import { Sun, Moon, Copy, Check, Download, CopyCheck } from 'lucide-react';

export const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <section className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md transition-colors duration-300">
        <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100 border-b border-slate-200 dark:border-slate-700 pb-3 mb-6">{title}</h2>
        {children}
    </section>
);

export const InputField: React.FC<{ label: string } & React.InputHTMLAttributes<HTMLInputElement>> = ({ label, ...props }) => (
    <div>
        <label htmlFor={props.id || props.name} className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{label}</label>
        <input {...props} className="w-full p-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-md shadow-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-slate-800 dark:text-slate-200" />
    </div>
);

export const SelectField: React.FC<{ label: string; children: React.ReactNode; } & React.SelectHTMLAttributes<HTMLSelectElement>> = ({ label, children, ...props }) => (
    <div>
        <label htmlFor={props.id || props.name} className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{label}</label>
        <select {...props} className="w-full p-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-md shadow-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-slate-800 dark:text-slate-200">
            {children}
        </select>
    </div>
);

export const ColumnCard: React.FC<{
    column: Column;
    index: number;
    jsonType: 'normal' | 'groupBy'; // <-- Recibe el tipo de JSON
    onDataTypeChange: (index: number, type: string) => void;
    onCustomMessageChange: (index: number, message: string) => void;
}> = ({ column, index, jsonType, onDataTypeChange, onCustomMessageChange }) => (
    <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-md border border-slate-200 dark:border-slate-700 space-y-4">
        {/* Nombre de la columna (siempre visible) */}
        <p className="font-mono text-sm text-slate-600 dark:text-slate-400 mb-2 break-all">{column.name}</p>

        {/* Campos adicionales para GroupBy */}
        {jsonType === 'groupBy' && (
            <div className="text-xs space-y-2 border-t border-slate-200 dark:border-slate-600 pt-3 mt-3">
                <div className="flex justify-between">
                    <span className="font-semibold text-slate-500 dark:text-slate-400">Select:</span>
                    <span className="font-mono text-slate-700 dark:text-slate-300">{column.select}</span>
                </div>
                <div className="flex justify-between">
                    <span className="font-semibold text-slate-500 dark:text-slate-400">Alias:</span>
                    <span className="font-mono text-slate-700 dark:text-slate-300">{column.alias}</span>
                </div>
                <div className="flex justify-between">
                    <span className="font-semibold text-slate-500 dark:text-slate-400">Agregación:</span>
                    <span className={`font-bold ${column.agg ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>{column.agg ? 'Sí' : 'No'}</span>
                </div>
            </div>
        )}

        {/* Tipo de Dato (siempre visible) */}
        <div className="flex flex-wrap gap-2">
            {DATA_TYPES.map(type => (
                <button key={type} onClick={() => onDataTypeChange(index, type)} className={`px-3 py-1 text-sm font-medium rounded-full transition-colors ${column.dataType === type ? 'bg-indigo-600 text-white shadow' : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-500'}`}>
                    {type}
                </button>
            ))}
        </div>

        {/* Mensaje personalizado (siempre visible) */}
        <div>
            <InputField
                label="Message para i18n (Opcional)"
                id={`custom-message-${index}`}
                type="text"
                placeholder={`Default: ${column.originalName}`}
                value={column.customMessage}
                onChange={(e) => onCustomMessageChange(index, e.target.value)}
            />
        </div>
    </div>
);

export const CheckboxCard: React.FC<{ id: string; label: string; checked: boolean; onChange: () => void; }> = ({ id, label, checked, onChange }) => (
    <div
        id={id}
        onClick={onChange}
        className={`flex items-center justify-center p-3 rounded-md border cursor-pointer transition-colors ${checked
                ? 'bg-indigo-100 dark:bg-indigo-900/60 border-indigo-500'
                : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500'
            }`}
    >
        <span title={label} className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">
            {label}
        </span>
    </div>
);

export const VariableCard: React.FC<{
    variable: Variable;
    isSelected: boolean;
    alias: string;
    onToggle: () => void;
    onAliasChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ variable, isSelected, alias, onToggle, onAliasChange }) => (
    <div
        onClick={onToggle}
        className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${isSelected
                ? 'bg-indigo-50 dark:bg-indigo-900/40 border-indigo-500'
                : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600'
            }`}
    >
        <span
            title={variable.var}
            className="font-medium text-slate-800 dark:text-slate-200 truncate block"
        >
            {variable.var}
        </span>

        {isSelected && (
            <div className="mt-4" onClick={(e) => e.stopPropagation()}>
                <InputField
                    label="Alias de tabla"
                    id={`alias-${variable.var}`}
                    type="text"
                    value={alias}
                    onChange={onAliasChange}
                    placeholder="Ej: v, p, t1"
                />
            </div>
        )}
    </div>
);

export const RadioCard: React.FC<{ id: string; name: string; label: string; description: string; checked: boolean; onChange: () => void; }> = ({ id, name, label, description, checked, onChange }) => (
    <div
        onClick={onChange}
        className={`flex items-start p-4 border rounded-lg cursor-pointer transition-all ${checked ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-500 ring-2 ring-indigo-500' : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
    >
        <input type="radio" id={id} name={name} checked={checked} readOnly className="sr-only" />
        <div className="text-sm">
            <span className="font-medium text-slate-900 dark:text-slate-100">{label}</span>
            <p className="text-slate-500 dark:text-slate-400">{description}</p>
        </div>
    </div>
);

export const QueryTextarea: React.FC<{ id: string; label: string; } & React.TextareaHTMLAttributes<HTMLTextAreaElement>> = ({ id, label, ...props }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{label}</label>
        <textarea id={id} rows={4} {...props} className="w-full p-3 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-mono text-sm text-slate-800 dark:text-slate-200" />
    </div>
);

export const ActionButton: React.FC<{ icon: React.ReactNode; text: string; onClick: () => void; className?: string; }> = ({ icon, text, onClick, className = "" }) => (
    <button onClick={onClick} className={`inline-flex items-center gap-2 px-4 py-2 border border-slate-300 dark:border-slate-600 text-sm font-medium rounded-md shadow-sm text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors ${className}`}>
        {icon}
        {text}
    </button>
);

export const ThemeToggleButton: React.FC<{ theme: 'light' | 'dark', onToggle: () => void }> = ({ theme, onToggle }) => (
    <button onClick={onToggle} className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-900 focus:ring-indigo-500 transition-colors">
        {theme === 'light' ? <Moon size={22} /> : <Sun size={22} />}
    </button>
);

export const Spinner = () => (
    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

interface CodeViewerProps {
    title: string;
    code: string;
    onCopy: () => void;
    onDownload: () => void;
    fileName: string;
    onCopyMinified?: () => void; // Prop opcional para la nueva funcionalidad
}

export const CodeViewer: React.FC<CodeViewerProps> = ({ title, code, onCopy, onDownload, onCopyMinified }) => {
    const [copied, setCopied] = useState(false);
    const [copiedMin, setCopiedMin] = useState(false);

    const handleCopy = (copyFn: () => void, setFn: React.Dispatch<React.SetStateAction<boolean>>) => {
        copyFn();
        setFn(true);
        setTimeout(() => setFn(false), 2000);
    };

    return (
        <div className="bg-slate-100 dark:bg-slate-900/50 rounded-lg shadow-inner overflow-hidden">
            <header className="flex justify-between items-center p-3 bg-slate-200/70 dark:bg-slate-800/50 border-b border-slate-300 dark:border-slate-700">
                <h4 className="font-mono text-sm font-semibold text-slate-700 dark:text-slate-300">{title}</h4>
                <div className="flex items-center gap-2">
                    {onCopyMinified && (
                        <button onClick={() => handleCopy(onCopyMinified, setCopiedMin)} title="Copiar Minificado" className="flex items-center gap-1.5 text-xs px-2 py-1 rounded-md bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors text-slate-600 dark:text-slate-300">
                            {copiedMin ? <Check size={14} className="text-green-500" /> : <CopyCheck size={14} />}
                            <span>Minificado</span>
                        </button>
                    )}
                    <button onClick={() => handleCopy(onCopy, setCopied)} title="Copiar" className="flex items-center gap-1.5 text-xs px-2 py-1 rounded-md bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors text-slate-600 dark:text-slate-300">
                        {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                        <span>Copiar</span>
                    </button>
                    <button onClick={onDownload} title="Descargar" className="flex items-center gap-1.5 text-xs px-2 py-1 rounded-md bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors text-slate-600 dark:text-slate-300">
                        <Download size={14} />
                        <span>Descargar</span>
                    </button>
                </div>
            </header>
            <pre className="p-4 text-sm font-mono overflow-x-auto text-slate-800 dark:text-slate-200 max-h-[600px] overflow-y-auto custom-scroll">
                <code>{code}</code>
            </pre>
        </div>
    );
};