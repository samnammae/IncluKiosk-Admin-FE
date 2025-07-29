import AcceptButton from "../button/AcceptButton";

interface SectionTitleProps {
  title: string;
  subText?: string;
  buttonText?: string;
  buttonClick?: () => void;
  buttonClassName?: string;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({
  title,
  subText,
  buttonText,
  buttonClick,
  buttonClassName,
}) => {
  return (
    <div className="mb-5 pb-2 border-b-2 border-gray-100 flex justify-between items-center">
      <div className="flex gap-5 items-end">
        <h2 className="text-lg font-semibold text-gray-800 ">{title}</h2>
        <p className="text-sm text-gray-500">{subText}</p>
      </div>
      {buttonText && (
        <AcceptButton onClick={buttonClick} className={buttonClassName}>
          {buttonText}
        </AcceptButton>
      )}
    </div>
  );
};
