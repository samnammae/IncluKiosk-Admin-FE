interface SectionTitleProps {
  title: string;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({ title }) => {
  return (
    <h2 className="text-lg font-semibold text-gray-800 mb-5 pb-2 border-b-2 border-gray-100">
      {title}
    </h2>
  );
};
