interface PageTitleProps {
  title: string;
  subtitle?: string;
}

export const PageTitle: React.FC<PageTitleProps> = ({ title, subtitle }) => {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-semibold text-gray-800 mb-2">{title}</h1>
      {subtitle && <p className="text-gray-600 text-base">{subtitle}</p>}
    </div>
  );
};
