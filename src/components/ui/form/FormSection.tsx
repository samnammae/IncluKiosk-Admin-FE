import { SectionTitle } from "../title/SectionTitle";

interface FormSectionProps {
  title: string;
  children: React.ReactNode;
}

export const FormSection: React.FC<FormSectionProps> = ({
  title,
  children,
}) => {
  return (
    <div className="flex flex-col">
      <SectionTitle title={title} />
      {children}
    </div>
  );
};
