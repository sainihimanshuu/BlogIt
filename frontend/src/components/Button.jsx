export default function Button({
    children,
    type = "button",
    bgColor = "bg-blue-600",
    textColor = "text-white",
    className = "",
    ...props
}) {
    return (
        <div>
            <button
                className={`${bgColor} ${textColor} ${className}`}
                type={type}
                {...props}
            >
                {children}
            </button>
        </div>
    );
}
