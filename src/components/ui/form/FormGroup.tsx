interface FormGroupProps {
  children: React.ReactNode;
  className?: string;
}

export const FormGroup: React.FC<FormGroupProps> = ({
  children,
  className = "",
}) => {
  return <div className={`mb-5 ${className}`}>{children}</div>;
};
