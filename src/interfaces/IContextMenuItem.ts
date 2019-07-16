interface IContextMenuItem {
    name: string;
    src?: string;
    subMenu?: IContextMenuSubMenu[];
    disabled?: boolean;
    clickable?: boolean;
    type?: string;
}

interface IContextMenuSubMenu {
    name: string;
}
