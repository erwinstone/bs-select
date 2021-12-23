declare class Bss {
    private classWrapper;
    private classItem;
    private classItems;
    private classClear;
    private classHeader;
    private classHidden;
    private classNoResults;
    private classTagRemove;
    private target;
    private search;
    private create;
    private clear;
    private maxHeight;
    private dropdown;
    private dropdownToggle;
    private searchInput;
    private clearBtn;
    private noResults;
    private isMultiple;
    private isDisabled;
    constructor(selectElement: HTMLSelectElement, options?: Options);
    private createDropdown;
    private updateDropdown;
    private registerEvents;
    setValue(value: string): void;
    removeValue(value: string): void;
    getValue(): string | string[];
    private setSelectedOption;
    private change;
    private dropdownToggleInner;
    private itemsInner;
    private placeholder;
    private tag;
    private item;
    private hasPlaceholder;
}
export default Bss;
interface Options {
    search?: boolean;
    create?: boolean;
    clear?: boolean;
    maxHeight?: string;
}
