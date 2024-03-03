import { useState } from "react";
import { Stylesheet } from "../../Stylesheet";
import If from "../../common/If";
import { getClassName } from "../../utils";
import { EditModal } from "./EditModal";
import { StylesheetItemTableRow } from "./StylesheetItemTableRow";

interface IProps {
    list: Stylesheet[];
    onRemove: (url: string) => unknown;
    onUpdate: (prevStylesheet: Stylesheet, newStylesheet: Stylesheet) => unknown;
}

export function StylesheetListTable (props: IProps) {
    const { list, onRemove, onUpdate } = props;
    const [ isEdit, setIsEdit ] = useState(false);
    const [ editStylesheet, setEditStylesheet ] = useState<Stylesheet>();

    const handleEdit = (stylesheet: Stylesheet) => {
        setEditStylesheet(stylesheet);
        setIsEdit(true);
    };

    const handleCancel = () => setIsEdit(false);

    const handleUpdate = (newStylesheet: Stylesheet) => {
        if (editStylesheet) {
            onUpdate(editStylesheet, newStylesheet);
            setIsEdit(false);
        }
    };

    const stylesheetsListTableContents = list.map((stylesheet, index) => 
        <StylesheetItemTableRow 
            key={index}
            stylesheet={stylesheet}
            onRemove={onRemove} 
            onEdit={handleEdit}
        />
    );

    const messageClassName = getClassName([
        "stylesheets-message",
        (list.length > 0 ? "hidden" : "")
    ]);

    const showEditModal = () => {
        if (editStylesheet && isEdit) {
            return (
                <EditModal 
                    stylesheet={editStylesheet} 
                    onUpdate={handleUpdate} 
                    onCancel={handleCancel} 
                ></EditModal>
            );
        }

        return <></>;
    };
    
    return (
        <>
            <div className={messageClassName}>No stylesheets added yet.</div>
            <If condition={list.length > 0}>
                <div className="stylesheets-list">
                    <table>
                        <thead>
                            <tr>
                                <th>URL</th>
                                <th className="whitespace-nowrap">Short Name</th>
                                <th className="whitespace-nowrap"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {stylesheetsListTableContents}
                        </tbody>
                    </table>
            
                    {showEditModal()}
                </div>
            </If>
        </>
    );
}
