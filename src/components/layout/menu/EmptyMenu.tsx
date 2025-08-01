import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
const EmptyMenu = () => {
  return (
    <div className="text-center py-12">
      <InfoRoundedIcon sx={{ fontSize: 48 }} className="mb-4 text-gray-700" />
      <h3 className="text-lg font-medium text-gray-900 ">메뉴가 없습니다</h3>
      <p className="text-gray-500">새로운 메뉴를 추가해보세요.</p>
    </div>
  );
};

export default EmptyMenu;
