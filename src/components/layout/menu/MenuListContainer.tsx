import React from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Paper,
  Chip,
  IconButton,
  Avatar,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { visuallyHidden } from "@mui/utils";
import EmptyMenu from "./EmptyMenu";

// MenuItem 타입 정의
interface MenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  optionCategories: string[];
  isSoldOut: boolean;
}

interface HeadCell {
  id: keyof MenuItem | "actions";
  label: string;
}

const headCells: readonly HeadCell[] = [
  {
    id: "name",
    label: "메뉴명",
  },
  {
    id: "price",
    label: "가격",
  },
  {
    id: "optionCategories",
    label: "옵션",
  },
  {
    id: "isSoldOut",
    label: "상태",
  },
  {
    id: "actions",
    label: "작업",
  },
];

// 정렬 함수들
function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = "asc" | "desc";

function getComparator<T>(
  order: Order,
  orderBy: keyof T
): (a: T, b: T) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// 테이블 헤더 컴포넌트
interface EnhancedTableProps {
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof MenuItem
  ) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler =
    (property: keyof MenuItem) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align="center"
            sortDirection={orderBy === headCell.id ? order : false}
            sx={{ paddingLeft: 5 }}
          >
            {headCell.id !== "actions" ? (
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : "asc"}
                onClick={createSortHandler(headCell.id as keyof MenuItem)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === "desc"
                      ? "sorted descending"
                      : "sorted ascending"}
                  </Box>
                ) : null}
              </TableSortLabel>
            ) : (
              headCell.label
            )}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

// Props 타입 정의
interface MenuListContainerProps {
  data: MenuItem[];
}

const MenuListContainer = ({ data }: MenuListContainerProps) => {
  if (data.length === 0) {
    return <EmptyMenu />;
  }
  // 받은 데이터를 그대로 사용
  const menuItems: MenuItem[] = React.useMemo(() => {
    return data;
  }, [data]);

  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] = React.useState<keyof MenuItem>("name");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof MenuItem
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEdit = (id: string) => {
    console.log("Edit menu:", id);
  };

  const handleDelete = (id: string) => {
    console.log("Delete menu:", id);
  };

  const handleToggleSoldOut = (id: string) => {
    console.log("Toggle sold out:", id);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ko-KR").format(price);
  };

  const visibleRows = React.useMemo(
    () =>
      [...menuItems]
        .sort(getComparator(order, orderBy))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [order, orderBy, page, rowsPerPage, menuItems]
  );
  const emptyRows =
    visibleRows.length < rowsPerPage ? rowsPerPage - visibleRows.length : 0;

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <TableContainer>
          <Table
            stickyHeader
            aria-label="menu table"
            sx={{ minWidth: 750 }}
            size="medium"
          >
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={menuItems.length}
            />
            <TableBody>
              {visibleRows.map((row, index) => {
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    tabIndex={-1}
                    key={row.id}
                    sx={{ cursor: "pointer" }}
                  >
                    <TableCell component="th" id={labelId} align="center">
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                          justifyContent: "center",
                        }}
                      >
                        <Avatar
                          src={row.image || ""}
                          alt={row.name}
                          sx={{ width: 40, height: 40 }}
                        >
                          {!row.image && row.name.charAt(0)}
                        </Avatar>
                        <Box sx={{ textAlign: "left" }}>
                          <Box sx={{ fontWeight: 600, mb: 0.5 }}>
                            {row.name}
                          </Box>
                          <Box
                            sx={{
                              fontSize: "0.875rem",
                              color: "text.secondary",
                              maxWidth: 200,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {row.description}
                          </Box>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ fontWeight: 600, color: "primary.main" }}>
                        ₩{formatPrice(row.price)}
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      {row.optionCategories.length > 0 ? (
                        <Box
                          sx={{
                            mt: 0.5,
                            display: "flex",
                            gap: 0.5,
                            flexWrap: "wrap",
                            justifyContent: "center",
                          }}
                        >
                          {row.optionCategories
                            .slice(0, 2)
                            .map((option, idx) => (
                              <Chip
                                key={idx}
                                label={option}
                                size="small"
                                variant="outlined"
                                sx={{ fontSize: "0.75rem", height: 20 }}
                              />
                            ))}
                          {row.optionCategories.length > 2 && (
                            <Chip
                              label={`+${row.optionCategories.length - 2}`}
                              size="small"
                              variant="outlined"
                              sx={{ fontSize: "0.75rem", height: 20 }}
                            />
                          )}
                        </Box>
                      ) : (
                        <span className=" text-slate-500 text-xs">
                          옵션없음
                        </span>
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={row.isSoldOut ? "품절" : "판매중"}
                        size="small"
                        color={row.isSoldOut ? "error" : "success"}
                        variant="filled"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Box
                        sx={{
                          display: "flex",
                          gap: 0.5,
                          justifyContent: "center",
                        }}
                      >
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(row.id);
                          }}
                          sx={{ color: "primary.main" }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(row.id);
                          }}
                          sx={{ color: "error.main" }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: 101 * emptyRows,
                  }}
                >
                  <TableCell colSpan={4} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={menuItems.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="페이지당 행 수:"
          labelDisplayedRows={({ from, to, count }) =>
            `${count}개 중 ${from}-${to}`
          }
        />
      </Paper>
    </Box>
  );
};

export default MenuListContainer;
