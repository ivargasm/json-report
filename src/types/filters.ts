// Filter-related types
import { DefaultValue } from './common';

export interface GenericFilter {
    selectId: string;
    schema: 'project' | 'stoiii' | 'stoiii_config';
    datasource: string;
    count_datasource: string;
}

export interface FilterProperties {
    default_value: DefaultValue;
}