import React from 'react';
import { Icon } from '@iconify/react';

export const TableContainer = ({ children, maxHeight = "450px" }) => (
    <div className="w-full rounded-2xl border border-base-content/20 bg-base-100 shadow-sm overflow-hidden animate-fade-in-up">
        <div className="overflow-x-auto overflow-y-auto relative custom-scrollbar" style={{ maxHeight }}>
            <table className="table table-sm table-zebra w-full whitespace-nowrap">
                {children}
            </table>
        </div>
    </div>
);

export const THead = ({ children }) => (
    <thead className="sticky top-0 z-20 bg-base-200/90 backdrop-blur-sm text-base-content font-headings shadow-sm text-center">
        <tr className="h-11 uppercase tracking-wider text-[11px] border-b-2 border-base-content/20 [&>th]:border-r [&>th]:border-base-content/10 [&>th:last-child]:border-r-0">
            {children}
        </tr>
    </thead>
);

export const TRow = ({ children, isSelected, onClick }) => (
    <tr
        onClick={onClick}
        className={`cursor-pointer transition-colors border-b border-base-content/5 ${isSelected ? 'bg-base-300 shadow-inner' : 'hover:bg-base-200/70'}`}
    >
        {children}
    </tr>
);

export const TCell = ({ children, className = "" }) => (
    <td className={`py-3 border-r border-base-content/10 last:border-r-0 text-base-content ${className}`}>
        {children}
    </td>
);

export const TableFooter = ({ limit, setLimit, totalData, currentDataCount, onNext, onPrev }) => (
    <div className="px-5 py-3 bg-base-200/30 border-t border-base-content/10 flex justify-between items-center">
        <div className="flex items-center gap-3 text-xs font-bold opacity-60 uppercase">
            <span>Limit:</span>
            <select
                value={limit}
                onChange={(e) => setLimit(Number(e.target.value))}
                className="select select-xs select-bordered rounded-lg bg-base-100 font-mono h-8"
            >
                {[5, 15, 30, 50].map(val => (
                    <option key={val} value={val}>{val}</option>
                ))}
            </select>
            <span>Baris</span>
        </div>

        <div className="flex items-center gap-5">
            <div className="text-[10px] font-bold opacity-40 uppercase tracking-tighter">
                Data: {currentDataCount} / {totalData}
            </div>
            <div className="flex gap-2">
                <button onClick={onPrev} className="btn btn-xs btn-square btn-outline border-base-content/20 hover:bg-primary hover:text-white transition-all">
                    <Icon icon="lucide:chevron-left" className="w-4 h-4" />
                </button>
                <button onClick={onNext} className="btn btn-xs btn-square btn-outline border-base-content/20 hover:bg-primary hover:text-white transition-all">
                    <Icon icon="lucide:chevron-right" className="w-4 h-4" />
                </button>
            </div>
        </div>
    </div>
);