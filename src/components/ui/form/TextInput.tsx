interface TextInputProps {
  id: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: "text" | "email" | "tel" | "password" | "number";
  required?: boolean;
  hasError?: boolean;
  className?: string;
}

export const TextInput: React.FC<TextInputProps> = ({
  id,
  value,
  onChange,
  onBlur,
  placeholder,
  type = "text",
  required = false,
  hasError = false,
  className = "",
}) => {
  return (
    <input
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      placeholder={placeholder}
      required={required}
      className={`
        w-full p-3 border-2 rounded-lg text-sm transition-all duration-200 bg-white
        focus:outline-none placeholder:text-gray-400
        ${
          hasError
            ? "border-red-500 focus:border-red-500 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]"
            : "border-gray-200 focus:border-blue-600 focus:shadow-[0_0_0_3px_rgba(30,64,175,0.1)]"
        }
        ${className}
      `}
    />
  );
};
