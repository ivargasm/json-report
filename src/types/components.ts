// Component-related types
import { ParsedColumn } from './common';

export interface TableColumn extends ParsedColumn {
    is_number?: boolean;
    is_sortable?: boolean;
    is_percent?: boolean;
    is_image?: boolean;
}

export interface ResumeColumn {
    column: string;
    is_number?: boolean;
    is_percent?: boolean;
    is_amount?: boolean;
    is_image?: boolean;
}

export interface ResumeRow {
    description: string;
    columns: ResumeColumn[];
}

export interface ReportComponent {
    id: string;
    type: 'resume' | 'table';
    title: string;
    schema: 'project' | 'stoiii' | 'stoiii_config';
    datasource: string;
    count_datasource?: string;
    last_date_datasource?: string;
    column_titles?: string[];
    rows?: ResumeRow[];
    columns?: TableColumn[];
    parsedColumns?: ParsedColumn[];
}