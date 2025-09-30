import ClosedIcon from "@/components/ui/icon/ClosedIcon";
import Image from "next/image";
import React from "react";
import macOsImg from "@/assets/images/macOs.webp";
import rasberrypiOs from "@/assets/images/rasberrypiOs.webp";
import { useQuery } from "@tanstack/react-query";
import { downloadAPI } from "@/lib/api/download";

const DownloadModal = ({
  isOpen,
  handleClose,
}: {
  isOpen: boolean;
  handleClose: () => void;
}) => {
  const {
    data: dataMac,
    isLoading: isMacLoading,
    isError: isMacError,
  } = useQuery({
    queryKey: ["mac"],
    queryFn: downloadAPI.downMac,
  });
  const {
    data: dataRas,
    isLoading: isRasLoading,
    isError: isRasError,
  } = useQuery({
    queryKey: ["ras"],
    queryFn: downloadAPI.downRas,
  });
  console.log("dataMac", dataMac);
  console.log("dataRas", dataRas);

  const handleDownload = (link: string) => {
    window.open(link, "_blank");
  };
  if (!isOpen) return null;

  const isLoading = isMacLoading || isRasLoading;
  const hasError = isMacError || isRasError;
  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
      onClick={handleClose}
    >
      <div
        className="relative max-w-3xl w-full max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded"
          onClick={handleClose}
        >
          <ClosedIcon />
        </button>

        <div className="flex flex-col">
          <div className="pt-5 px-5 flex flex-col gap-2 border-b border-b-gray-300">
            <div className="text-xl font-bold">IncluKiosk 앱 다운로드</div>
            <div className="text-gray-500 mb-3">
              플랫폼에 맞는 설치 파일을 다운로드하세요
            </div>
          </div>

          {/* 전체 로딩 상태 */}
          {isLoading && (
            <div className="flex items-center justify-center py-20">
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-gray-600">다운로드 정보를 불러오는 중...</p>
              </div>
            </div>
          )}

          {/* 에러 상태 */}
          {hasError && !isLoading && (
            <div className="flex items-center justify-center py-20">
              <div className="flex flex-col items-center gap-3 text-red-500">
                <svg
                  className="w-12 h-12"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="font-semibold">
                  다운로드 정보를 불러올 수 없습니다
                </p>
                <p className="text-sm text-gray-500">
                  잠시 후 다시 시도해주세요
                </p>
              </div>
            </div>
          )}

          {/* 정상 데이터 */}
          {!isLoading && !hasError && (
            <div className="flex w-full justify-center gap-10 p-8">
              {/* macOS Card */}
              <div className="py-5 px-12 flex flex-col gap-2 items-center border-2 border-gray-300 rounded-xl hover:border-blue-500 hover:shadow-lg hover:scale-105 transition-all">
                <div>
                  <Image
                    src={macOsImg}
                    alt="mac os"
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                </div>
                <div className="font-bold text-xl mb-8">macOS</div>
                <div className="text-gray-500 text-nowrap">
                  📦 {dataMac?.fileName || "-"}
                </div>
                <div className="text-gray-500 mb-4">
                  버전 {dataMac?.version || "-"}
                </div>
                <button
                  className="w-full bg-blue-600 text-white rounded-xl p-2 text-center hover:bg-blue-700 active:bg-blue-800 hover:shadow-lg active:shadow-inner active:scale-95 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
                  onClick={() =>
                    dataMac?.downloadUrl && handleDownload(dataMac.downloadUrl)
                  }
                  disabled={!dataMac?.downloadUrl}
                >
                  mac용 다운로드
                </button>
              </div>

              {/* Raspberry Pi Card */}
              <div className="py-5 px-12 flex flex-col gap-2 items-center border-2 border-gray-300 rounded-xl hover:border-blue-500 hover:shadow-lg hover:scale-105 transition-all">
                <div>
                  <Image
                    src={rasberrypiOs}
                    alt="rasberrypi os"
                    className="w-20 h-20 object-cover rounded-lg p-2" //이미지가 더 커서 임의 padding추가
                  />
                </div>
                <div className="font-bold text-xl mb-8">Raspberry Pi OS</div>
                <div className="text-gray-500 text-nowrap">
                  📦 {dataRas?.fileName || "-"}
                </div>
                <div className="text-gray-500 mb-4">
                  버전 {dataRas?.version || "-"}
                </div>
                <button
                  className="w-full bg-blue-600 text-white rounded-xl p-2 text-center hover:bg-blue-700 active:bg-blue-800 hover:shadow-lg active:shadow-inner active:scale-95 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
                  onClick={() =>
                    dataRas?.downloadUrl && handleDownload(dataRas.downloadUrl)
                  }
                  disabled={!dataRas?.downloadUrl}
                >
                  raspberry pi용 다운로드
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DownloadModal;
