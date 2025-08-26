// Common types used across the application

export interface Column {
    originalName: string;
    name: string;
    dataType: string;
    customMessage?: string;
    select?: string;
    alias?: string;
    agg?: boolean;
}

export interface Variable {
    var: string;
    dsc: string;
    filterType: string;
    defaultAlias: string;
    sql_include: string;
    sql_exclude: string;
}

export interface DatasetType {
    id: number;
    dsci18n: string;
    description: string;
}

export interface DefaultValue {
    value: string;
    description: string;
}

export interface ParsedColumn {
    column: string;
    description: string;
}