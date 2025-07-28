interface FormContainerProps {
  children: React.ReactNode;
  onSubmit?: (e: React.FormEvent) => void;
}

export const FormContainer: React.FC<FormContainerProps> = ({
  children,
  onSubmit,
}) => {
  return (
    <div className="bg-white rounded-xl p-10 shadow-sm">
      <div onSubmit={onSubmit}>{children}</div>
    </div>
  );
};
