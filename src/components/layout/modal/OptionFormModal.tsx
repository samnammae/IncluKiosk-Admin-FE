import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Switch,
  Typography,
  Divider,
  IconButton,
  Box,
  Chip,
} from "@mui/material";
import { Add, Delete, Edit } from "@mui/icons-material";
import { optionCategoriesType, OptionItem } from "@/lib/store/MenuStore";

interface OptionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: OptionGroupFormData) => void;
  editData?: optionCategoriesType | null;
  isLoading?: boolean;
}

export interface OptionGroupFormData {
  name: string;
  required: boolean;
  type: "SINGLE" | "MULTIPLE";
  options: OptionFormData[];
}

export interface OptionFormData {
  id?: number;
  name: string;
  price: number;
  default: boolean;
}

const OptionFormModal: React.FC<OptionFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editData,
  isLoading = false,
}) => {
  const isEditMode = !!editData;

  const [formData, setFormData] = useState<OptionGroupFormData>({
    name: "",
    required: false,
    type: "SINGLE",
    options: [],
  });

  const [errors, setErrors] = useState<{
    name?: string;
    options?: string;
  }>({});

  // 수정 모드일 때 데이터 초기화
  useEffect(() => {
    if (isEditMode && editData) {
      setFormData({
        name: editData.name,
        required: editData.required,
        type: editData.type,
        options: editData.options.map((opt) => ({
          id: opt.id,
          name: opt.name,
          price: opt.price,
          default: opt.default,
        })),
      });
    } else {
      // 생성 모드일 때 초기화
      setFormData({
        name: "",
        required: false,
        type: "SINGLE",
        options: [],
      });
    }
    setErrors({});
  }, [isEditMode, editData, isOpen]);

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!formData.name.trim()) {
      newErrors.name = "옵션 그룹명을 입력해주세요";
    }

    if (formData.options.length === 0) {
      newErrors.options = "최소 1개 이상의 옵션을 추가해주세요";
    }

    // 기본 옵션 검증 (SINGLE 타입일 때만 하나의 기본값 허용)
    if (formData.type === "SINGLE") {
      const defaultCount = formData.options.filter((opt) => opt.default).length;
      if (defaultCount > 1) {
        newErrors.options =
          "하나 선택 타입에서는 기본 옵션을 1개만 설정할 수 있습니다";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const addOption = () => {
    setFormData((prev) => ({
      ...prev,
      options: [
        ...prev.options,
        {
          name: "",
          price: 0,
          default: false,
        },
      ],
    }));
  };

  const updateOption = (
    index: number,
    field: keyof OptionFormData,
    value: string | boolean | number
  ) => {
    console.log(value);
    setFormData((prev) => ({
      ...prev,
      options: prev.options.map((opt, i) =>
        i === index ? { ...opt, [field]: value } : opt
      ),
    }));
  };

  const removeOption = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index),
    }));
  };

  const handleDefaultChange = (index: number, isDefault: boolean) => {
    if (formData.type === "SINGLE" && isDefault) {
      // SINGLE 타입일 때는 다른 옵션들의 기본값을 false로 변경
      setFormData((prev) => ({
        ...prev,
        options: prev.options.map((opt, i) => ({
          ...opt,
          default: i === index ? isDefault : false,
        })),
      }));
    } else {
      updateOption(index, "default", isDefault);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { minHeight: "60vh" },
      }}
    >
      <DialogTitle>
        {isEditMode ? "옵션 그룹 수정" : "옵션 그룹 생성"}
      </DialogTitle>

      <DialogContent dividers>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {/* 기본 정보 */}
          <Box>
            <Typography variant="h6" gutterBottom>
              기본 정보
            </Typography>

            <TextField
              label="옵션 그룹명"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              error={!!errors.name}
              helperText={errors.name}
              fullWidth
              margin="normal"
              placeholder="예: 사이즈, 온도, 토핑"
            />

            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 2 }}>
              <Typography>필수 선택</Typography>
              <Switch
                checked={formData.required}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    required: e.target.checked,
                  }))
                }
              />
              <Chip
                label={formData.required ? "필수" : "선택"}
                color={formData.required ? "error" : "primary"}
                size="small"
              />
            </Box>

            <FormControl component="fieldset" sx={{ mt: 2 }}>
              <FormLabel component="legend">선택 타입</FormLabel>
              <RadioGroup
                row
                value={formData.type}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    type: e.target.value as "SINGLE" | "MULTIPLE",
                  }))
                }
              >
                <FormControlLabel
                  value="SINGLE"
                  control={<Radio />}
                  label="하나 선택"
                />
                <FormControlLabel
                  value="MULTIPLE"
                  control={<Radio />}
                  label="다중 선택"
                />
              </RadioGroup>
            </FormControl>
          </Box>

          <Divider />

          {/* 옵션 목록 */}
          <Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography variant="h6">
                옵션 목록 ({formData.options.length}개)
              </Typography>
              <Button
                startIcon={<Add />}
                onClick={addOption}
                variant="outlined"
                size="small"
              >
                옵션 추가
              </Button>
            </Box>

            {errors.options && (
              <Typography color="error" variant="body2" sx={{ mb: 2 }}>
                {errors.options}
              </Typography>
            )}

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                maxHeight: "300px",
                overflowY: "auto",
              }}
            >
              {formData.options.map((option, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    p: 2,
                    border: "1px solid #e0e0e0",
                    borderRadius: 2,
                    backgroundColor: "#fafafa",
                  }}
                >
                  <TextField
                    label="옵션명"
                    value={option.name}
                    onChange={(e) =>
                      updateOption(index, "name", e.target.value)
                    }
                    size="small"
                    sx={{ flex: 1 }}
                    placeholder="예: Small, Medium, Large"
                  />

                  <TextField
                    label="추가 가격"
                    type="number"
                    value={option.price}
                    onChange={(e) =>
                      updateOption(
                        index,
                        "price",
                        parseInt(e.target.value) || 0
                      )
                    }
                    size="small"
                    sx={{ width: 120 }}
                    InputProps={{
                      endAdornment: <Typography variant="body2">원</Typography>,
                    }}
                  />

                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      minWidth: 60,
                    }}
                  >
                    <Typography variant="body2" sx={{ fontSize: "0.75rem" }}>
                      기본값
                    </Typography>
                    <Switch
                      checked={option.default}
                      onChange={(e) =>
                        handleDefaultChange(index, e.target.checked)
                      }
                      size="small"
                    />
                  </Box>

                  <IconButton
                    onClick={() => removeOption(index)}
                    color="error"
                    size="small"
                  >
                    <Delete />
                  </IconButton>
                </Box>
              ))}

              {formData.options.length === 0 && (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    py: 4,
                    color: "grey.500",
                  }}
                >
                  <Typography variant="body2">옵션을 추가해주세요</Typography>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button onClick={handleClose} disabled={isLoading}>
          취소
        </Button>
        <Button onClick={handleSubmit} variant="contained" disabled={isLoading}>
          {isLoading ? "처리중..." : isEditMode ? "수정" : "생성"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OptionFormModal;
