import {
  Box,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
} from '@mui/material';
import { Bill } from '@/types/database';
import { colors } from '@/app/theme/colors';
import { formatDate, formatBillId } from '@/utils/formatters';

const BILLS_PER_PAGE = 30;

interface BillTableProps {
  bills: Bill[];
  currentPage: number;
  onPageChange: (page: number) => void;
  onViewBill: (bill: Bill) => void;
}

export default function BillTable({ bills, currentPage, onPageChange, onViewBill }: BillTableProps) {
  const totalPages = Math.ceil(bills.length / BILLS_PER_PAGE);
  const currentBills = bills.slice(
    (currentPage - 1) * BILLS_PER_PAGE,
    currentPage * BILLS_PER_PAGE
  );

  return (
    <Box sx={{ maxWidth: '1200px', mx: 'auto', mt: 2 }}>
      <TableContainer
        component={Paper}
        sx={{
          backgroundColor: colors.background.white,
          boxShadow: '0px 2px 8px rgba(0,0,0,0.1)',
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: colors.neutral.gray100 }}>
              <TableCell sx={{ fontWeight: 'bold', color: colors.text.primary, fontSize: '0.95rem', py: 2 }}>
                Bill ID
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: colors.text.primary, fontSize: '0.95rem', py: 2 }}>
                Date
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: colors.text.primary, fontSize: '0.95rem', py: 2 }}>
                Action
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentBills.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} sx={{ textAlign: 'center', py: 4 }}>
                  <Typography sx={{ color: colors.text.secondary }}>No bills found</Typography>
                </TableCell>
              </TableRow>
            ) : (
              currentBills.map((bill) => (
                <TableRow
                  key={bill.id}
                  sx={{ '&:hover': { backgroundColor: colors.neutral.gray50 } }}
                >
                  <TableCell sx={{ fontWeight: 'bold', color: colors.text.primary, fontSize: '1.05rem', py: 2 }}>
                    {formatBillId(bill)}
                  </TableCell>
                  <TableCell sx={{ color: colors.text.primary, fontSize: '0.95rem', py: 2 }}>
                    {formatDate(bill.version_date)}
                  </TableCell>
                  <TableCell sx={{ py: 2 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => onViewBill(bill)}
                      sx={{
                        borderColor: colors.primary,
                        color: colors.primary,
                        fontWeight: 500,
                        '&:hover': {
                          borderColor: colors.primaryHover,
                          backgroundColor: colors.primaryLight,
                        },
                      }}
                    >
                      View Bill
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {bills.length > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(_, value) => {
              onPageChange(value);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            color="primary"
            sx={{
              '& .MuiPaginationItem-root': {
                color: colors.text.primary,
                '&.Mui-selected': {
                  backgroundColor: colors.primary,
                  color: colors.text.white,
                  '&:hover': { backgroundColor: colors.primaryHover },
                },
                '&:hover': { backgroundColor: colors.primaryLight },
              },
            }}
          />
        </Box>
      )}
    </Box>
  );
}
