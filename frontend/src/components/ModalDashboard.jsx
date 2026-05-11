import React from "react";
import { Icon } from "@iconify/react";

const ModalDashboard = ({
    id,
    title,
    icon,
    children,
    onSave,
    onCancel,
    isSaving,
    saveLabel = "Simpan Data",
    cancelLabel = "Batal",
    maxWidth = "max-w-2xl",
}) => {
    return (
        <dialog id={id} className="modal modal-middle font-text">
            <div className={`modal-box sm:w-11/12 ${maxWidth} bg-base-100 border border-base-content/20 rounded-[2rem] p-0 overflow-hidden shadow-2xl`}>
                <div className="p-6 border-b border-base-content/10 bg-base-200/50 flex items-center gap-3">
                    {icon && (
                        <div className="p-2 bg-primary/10 text-primary rounded-xl">
                            <Icon icon={icon} className="w-6 h-6" />
                        </div>
                    )}
                    <h3 className="font-bold text-xl font-display text-base-content">
                        {title}
                    </h3>
                </div>

                <div className="p-6 md:p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                    {children}
                </div>

                <div className="p-6 border-t border-base-content/10 bg-base-100 flex flex-col-reverse sm:flex-row justify-end gap-3">
                    <button
                        type="button"
                        className="btn btn-neutral rounded-xl flex-1 sm:flex-none px-8"
                        onClick={onCancel}
                        disabled={isSaving}
                    >
                        <Icon icon="mdi:close-circle" className="w-5 h-5" />
                        {cancelLabel}
                    </button>
                    <button
                        type="button"
                        className="btn btn-primary rounded-xl flex-1 sm:flex-none md:w-48 shadow-lg shadow-primary/20"
                        onClick={onSave}
                        disabled={isSaving}
                    >
                        {isSaving ? (
                            <span className="loading loading-ring loading-md"></span>
                        ) : (
                            <Icon icon="mdi:content-save" className="w-5 h-5" />
                        )}
                        {isSaving ? "Menyimpan..." : saveLabel}
                    </button>
                </div>
            </div>
            <form method="dialog" className="modal-backdrop bg-black/40 backdrop-blur-[2px]">
                <button onClick={onCancel}>tutup</button>
            </form>
        </dialog>
    );
};

export default ModalDashboard;