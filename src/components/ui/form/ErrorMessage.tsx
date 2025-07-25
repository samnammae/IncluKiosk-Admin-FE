interface ErrorMessageProps {
  message: string;
  show: boolean;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  show,
}) => {
  if (!show) return null;

  return (
    <p className="text-red-500 text-xs mt-1 font-medium transition-all duration-200">
      {message}
    </p>
  );
};
