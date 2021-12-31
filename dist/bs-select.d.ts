declare class Bss {
    #private;
    constructor(selectElement: HTMLSelectElement, options?: Options);
    setValue(value: string): void;
    removeValue(value: string): void;
    getValue(): string | string[];
}
export default Bss;
interface Options {
    search?: boolean;
    create?: boolean;
    clear?: boolean;
    maxHeight?: string;
}
