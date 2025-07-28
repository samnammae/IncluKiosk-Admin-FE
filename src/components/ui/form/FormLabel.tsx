interface FormLabelProps {
  htmlFor: string;
  children: React.ReactNode;
  required?: boolean;
}

export const FormLabel: React.FC<FormLabelProps> = ({
  htmlFor,
  children,
  required = false,
}) => {
  return (
    <label
      htmlFor={htmlFor}
      className="block text-gray-700 text-sm font-medium mb-2"
    >
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );
};
