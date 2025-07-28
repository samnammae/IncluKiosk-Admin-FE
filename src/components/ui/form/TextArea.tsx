interface TextAreaProps {
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  rows?: number;
  hasError?: boolean;
  className?: string;
}

export const TextArea: React.FC<TextAreaProps> = ({
  id,
  value,
  onChange,
  placeholder,
  rows = 4,
  hasError = false,
  className = "",
}) => {
  return (
    <textarea
      id={id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      className={`
        w-full p-3 border-2 rounded-lg text-sm transition-all duration-200 bg-white
        focus:outline-none placeholder:text-gray-400 resize-vertical
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
