import React from "react";
import { Icon } from "@iconify/react";
import { useModalStore } from "../stores/modalStore";

const GlobalModal = () => {
    const { isOpen, config, closeModal } = useModalStore();

    if (!isOpen) return null;

    let iconName = "solar:info-circle-bold";
    let iconColor = "text-info";
    let confirmBtnColor = "btn-primary";

    if (config.type === "success") {
        iconName = "solar:check-circle-bold";
        iconColor = "text-success";
        confirmBtnColor = "btn-success text-white";
    } else if (config.type === "error") {
        iconName = "solar:danger-circle-bold";
        iconColor = "text-error";
        confirmBtnColor = "btn-error text-white";
    } else if (config.type === "warning" || config.type === "confirm") {
        iconName = "solar:shield-warning-bold";
        iconColor = "text-warning";
        confirmBtnColor = "btn-warning text-white";
    }

    return (
        <dialog className="modal modal-open modal-bottom sm:modal-middle">
            <div className="modal-box relative text-center sm:text-left">
                <button
                    className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                    onClick={() => closeModal(false)}
                >
                    ✕
                </button>

                <div className="flex justify-center mb-4">
                    <Icon icon={iconName} className={`w-20 h-20 ${iconColor}`} />
                </div>

                <h3 className="font-bold text-2xl font-display text-center">{config.title}</h3>
                <p className="py-4 text-center text-base-content/80 text-lg">
                    {config.message}
                </p>

                <div className="modal-action justify-center gap-2">
                    {config.type === "confirm" && (
                        <button
                            className="btn btn-ghost"
                            onClick={() => closeModal(false)}
                        >
                            {config.cancelText || "Batal"}
                        </button>
                    )}

                    <button
                        className={`btn ${confirmBtnColor} px-8`}
                        onClick={() => closeModal(true)}
                    >
                        {config.confirmText || "Oke"}
                    </button>
                </div>
            </div>

            <form method="dialog" className="modal-backdrop">
                <button onClick={() => closeModal(false)}>close</button>
            </form>
        </dialog>
    );
};

export default GlobalModal;