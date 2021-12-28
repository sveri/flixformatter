
export function getIdentifierName(identifier: {type: string, text: string}): string {
    if(identifier.type !== 'identifier') {
        throw new Error('identifier needs to be of type identifier');
    }
    return identifier.text;
}

export function getSpaces(tabSize: number, indentationLevel: number): string {
    return " ".repeat(tabSize * indentationLevel);
}

export function withSpaces(s: string, tabSize: number, indentationLevel: number): string {
    return " ".repeat(tabSize * indentationLevel) + s;
}