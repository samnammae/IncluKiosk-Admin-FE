interface FormGridProps {
  children: React.ReactNode;
  columns?: 1 | 2;
}

export const FormGrid: React.FC<FormGridProps> = ({
  children,
  columns = 2,
}) => {
  return (
    <div
      className={`grid gap-10 ${
        columns === 2 ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"
      }`}
    >
      {children}
    </div>
  );
};
