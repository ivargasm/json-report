// Store-related types
import { Column, DefaultValue, ParsedColumn } from './common';
import { ReportComponent } from './components';
import { GenericFilter, FilterProperties } from './filters';

// Config Store Types
export interface ConfigState {
    theme: 'light' | 'dark';
    reportName: string;
    projectName: string;
    configType: 'adhoc' | 'preset';
    jsonType: 'normal' | 'groupBy';
    mainSql: string;
    columns: Column[];
    selectedVariables: Record<string, string>;
    selectedDatasetType: number;
    preQueries: string;
    postQueries: string;
    generatedJson: string;
    generatedJsonMinified: string;
    generatedSql: string;
    isAnalyzing: boolean;
    analysisError: string | null;
    sqlTemplateForGroupBy: string | null;

    // Actions
    toggleTheme: () => void;
    setReportName: (name: string) => void;
    setProjectName: (name: string) => void;
    setConfigType: (type: 'adhoc' | 'preset') => void;
    setJsonType: (type: 'normal' | 'groupBy') => void;
    setMainSql: (sql: string) => void;
    setPreQueries: (queries: string) => void;
    setPostQueries: (queries: string) => void;
    handleDataTypeChange: (index: number, newType: string) => void;
    handleCustomMessageChange: (index: number, message: string) => void;
    handleVariableToggle: (variableVar: string) => void;
    handleAliasChange: (variableVar: string, alias: string) => void;
    setSelectedDatasetType: (id: number) => void;
    analyzeSql: () => Promise<void>;
    generateOutputs: () => void;
}

// Components Store Types
export interface ComponentsStore {
    components: ReportComponent[];
    addComponent: (component: ReportComponent) => void;
    updateComponent: (id: string, updated: Partial<ReportComponent>) => void;
    removeComponent: (id: string) => void;
    setParsedColumns: (id: string, columns: ParsedColumn[]) => void;
    clear: () => void;
    loadFromJSON: (data: { components?: ReportComponent[] }) => void;
}

// Filters Store Types
export interface FiltersStore {
    filters: string[];
    generic_filters: GenericFilter[];
    filters_properties: Record<string, FilterProperties>;
    addFilter: (filter: string) => void;
    removeFilter: (filter: string) => void;
    updateGenericFilter: (filter: GenericFilter) => void;
    updateDefaultValue: (selectId: string, value: DefaultValue) => void;
    reset: () => void;
    clearFilters: () => void;
    loadFromJSON: (data: { 
        filters?: string[]; 
        generic_filters?: GenericFilter[]; 
        filters_properties?: Record<string, FilterProperties> 
    }) => void;
}