import React, { useState } from 'react';
import { Icon } from '@iconify/react';

const FloatingLabelInput = ({ label, id, type = 'text', value, onChange, readOnly, disabled, className = '', rightElement, ...props }) => {
    const [isFocused, setIsFocused] = useState(false);

    const alwaysFloatTypes = ['date', 'time', 'datetime-local', 'month', 'week'];
    const labelShouldFloat = alwaysFloatTypes.includes(type) || isFocused || String(value || '').length > 0 || value === 0;

    const isNotEditable = readOnly || disabled;

    return (
        <div className="relative form-control w-full font-text group">
            <input
                type={type}
                id={id}
                name={id || props.name}
                value={value}
                onChange={onChange}
                readOnly={readOnly}
                disabled={disabled}
                className={`peer w-full h-14 pl-4 ${rightElement ? 'pr-12' : 'pr-4'} bg-transparent rounded-xl relative z-10 text-base transition-all duration-300 outline-none placeholder:text-transparent
                           ${isNotEditable ? 'cursor-not-allowed text-base-content/50' : 'text-base-content'}
                           ${type === 'number' ? '[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none' : ''} ${className}`}
                placeholder={label}
                onFocus={() => !isNotEditable && setIsFocused(true)}
                onBlur={() => !isNotEditable && setIsFocused(false)}
                {...props}
            />

            <fieldset
                aria-hidden="true"
                className={`absolute -top-2.25 bottom-0 left-0 right-0 rounded-xl border transition-all duration-300 pointer-events-none m-0 p-0
                    ${isNotEditable
                        ? 'border-base-content/20'
                        : 'border-base-content/30 group-hover:border-base-content/50 group-focus-within:border-base-content group-focus-within:ring-[1px] group-focus-within:ring-primary/5'
                    } peer-autofill:[&>legend]:max-w-full peer-autofill:[&>legend]:px-1
                `}
            >
                <legend className={`opacity-0 text-[13px] font-extrabold whitespace-nowrap overflow-hidden ml-3 transition-all duration-300 ${labelShouldFloat ? 'max-w-full px-1' : 'max-w-0 px-0'}`}>
                    {label}
                </legend>
            </fieldset>

            <label
                htmlFor={id || props.name}
                className={`absolute left-3 px-1 transition-all duration-300 pointer-events-none z-20
                           ${labelShouldFloat
                        ? `-top-2.25 text-[13px] font-extrabold ${isNotEditable ? 'text-base-content/50' : 'text-base-content'}`
                        : `top-4 text-base font-medium ${isNotEditable ? 'text-base-content/40' : 'text-base-content/60'}`
                    } peer-autofill:-top-2.25 peer-autofill:text-[13px] peer-autofill:font-extrabold`}
            >
                {label}
            </label>

            {rightElement && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 z-30 flex items-center justify-center">
                    {rightElement}
                </div>
            )}
        </div>
    );
};

export const FloatingLabelTextarea = ({ label, id, value, onChange, readOnly, disabled, className = '', ...props }) => {
    const [isFocused, setIsFocused] = useState(false);
    const labelShouldFloat = isFocused || (value && value.toString().length > 0);
    const isNotEditable = readOnly || disabled;

    return (
        <div className="relative form-control w-full font-text group">
            <fieldset
                aria-hidden="true"
                className={`absolute -top-2.25 bottom-0 left-0 right-0 rounded-xl border transition-all duration-300 pointer-events-none m-0 p-0
                    ${isNotEditable
                        ? 'border-base-content/20'
                        : 'border-base-content/30 group-hover:border-base-content/50 group-focus-within:border-base-content group-focus-within:ring-[1px] group-focus-within:ring-primary/30'
                    }
                `}
            >
                <legend className={`opacity-0 text-[13px] font-extrabold whitespace-nowrap overflow-hidden ml-3 transition-all duration-300 ${labelShouldFloat ? 'max-w-full px-1' : 'max-w-0 px-0'}`}>
                    {label}
                </legend>
            </fieldset>

            <textarea
                id={id}
                name={id || props.name}
                value={value}
                onChange={onChange}
                readOnly={readOnly}
                disabled={disabled}
                className={`w-full pt-4 pb-4 px-4 bg-transparent rounded-xl text-base min-h-30 transition-all duration-300 outline-none placeholder:text-transparent resize-none relative z-10
                           ${isNotEditable ? 'cursor-not-allowed text-base-content/50' : 'text-base-content'} ${className}`}
                placeholder={label}
                onFocus={() => !isNotEditable && setIsFocused(true)}
                onBlur={() => !isNotEditable && setIsFocused(false)}
                {...props}
            ></textarea>

            <label
                htmlFor={id || props.name}
                className={`absolute left-3 px-1 transition-all duration-300 pointer-events-none z-20
                           ${labelShouldFloat
                        ? `-top-2.25 text-[13px] font-extrabold ${isNotEditable ? 'text-base-content/50' : 'text-base-content'}`
                        : `top-4 text-base font-medium ${isNotEditable ? 'text-base-content/40' : 'text-base-content/60'}`
                    }`}
            >
                {label}
            </label>
        </div>
    );
};

export const FloatingLabelSelect = ({ label, id, value, onChange, disabled, children, className = '', ...props }) => {
    const [isFocused, setIsFocused] = useState(false);
    const labelShouldFloat = true;
    const isNotEditable = disabled;

    return (
        <div className="relative form-control w-full font-text group">
            <select
                id={id}
                name={id || props.name}
                value={value}
                onChange={onChange}
                disabled={disabled}
                className={`select w-full h-14 bg-transparent rounded-xl text-base transition-all duration-300 outline-none border-none focus:outline-none focus:border-none focus:ring-0 relative z-10
                           ${disabled ? 'cursor-not-allowed text-base-content/50' : 'text-base-content'} ${className}`}
                onFocus={() => !disabled && setIsFocused(true)}
                onBlur={() => !disabled && setIsFocused(false)}
                {...props}
            >
                {children}
            </select>

            <fieldset
                aria-hidden="true"
                className={`absolute -top-2.25 bottom-0 left-0 right-0 rounded-xl border transition-all duration-300 pointer-events-none m-0 p-0
                    ${isNotEditable
                        ? 'border-base-content/20'
                        : 'border-base-content/30 group-hover:border-base-content/50 group-focus-within:border-base-content group-focus-within:ring-[1px] group-focus-within:ring-primary/5'
                    }
                `}
            >
                <legend className={`opacity-0 text-[13px] font-extrabold whitespace-nowrap overflow-hidden ml-3 transition-all duration-300 ${labelShouldFloat ? 'max-w-full px-1' : 'max-w-0'}`}>
                    {label}
                </legend>
            </fieldset>

            <label
                htmlFor={id || props.name}
                className={`absolute left-3 px-1 transition-all duration-300 pointer-events-none z-20
                           ${labelShouldFloat
                        ? `-top-2.25 text-[13px] font-extrabold ${disabled ? 'text-base-content/50' : 'text-base-content'}`
                        : `top-4 text-base font-medium ${disabled ? 'text-base-content/40' : 'text-base-content/60'}`
                    }`}
            >
                {label}
            </label>
        </div>
    );
};

export default FloatingLabelInput;