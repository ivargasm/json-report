// Utility functions

export const formatSql = (sql: string): string => {
    return sql.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
};

export const escapeMessage = (message: string): string => {
    return message.replace(/'/g, "''");
};

export const generateId = (): string => {
    return Math.random().toString(36).substr(2, 9);
};

export const downloadJSON = (data: object, filename: string): void => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (err) {
        console.error('Failed to copy text: ', err);
        return false;
    }
};