import { forwardRef, useId } from "react";

const Input = forwardRef(function Input(
    { label, className = "", placeHolder = "", type = "text", error, ...props },
    ref
) {
    const id = useId();
    return (
        <div>
            {label && <label htmlFor={id}>{label}</label>}
            <input
                id={id}
                type={type}
                placeholder={placeHolder}
                className={`${className}`}
                ref={ref}
                {...props}
            />
            {error && <span>{error}</span>}
        </div>
    );
});

export default Input;
