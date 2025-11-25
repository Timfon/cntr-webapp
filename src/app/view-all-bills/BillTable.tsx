"use client";
import React from 'react';
import {
  Box,
  Typography,
  Button,
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

interface BillTableProps {
  bills: Bill[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
  onPageChange: (_: unknown, value: number) => void;
  onViewBill: (bill: Bill) => void;
}

const BILLS_PER_PAGE = 30;

export default function BillTable({
  bills,
  currentPage,
  totalPages,
  totalCount,
  onPageChange,
  onViewBill,
}: BillTableProps) {
  return (
    <>
      <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: colors.neutral.gray50 }}>
              <TableCell sx={{ fontWeight: 600, color: colors.text.primary }}>
                Bill
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: colors.text.primary }}>
                Date
              </TableCell>
              <TableCell sx={{ fontWeight: 600, color: colors.text.primary }}>
                Action
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bills.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                    No bills found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              bills.map((bill) => (
                <TableRow key={bill.id} hover>
                  <TableCell>
                    <Box>
                      <Typography
                        variant="body2"
                        sx={{ color: colors.text.primary, fontWeight: 500 }}
                      >
                        {bill.title || 'N/A'}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: colors.text.secondary, fontSize: '0.75rem' }}
                      >
                        {formatBillId(bill)}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{ color: colors.text.primary }}
                    >
                      {formatDate(bill.version_date)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="text"
                      size="small"
                      onClick={() => onViewBill(bill)}
                      sx={{
                        color: colors.primary,
                        textTransform: 'none',
                        fontWeight: 500,
                        '&:hover': {
                          backgroundColor: colors.primaryLighter,
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

      {/* Pagination */}
      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 4 }}>
          <Typography variant="body2" sx={{ color: colors.text.secondary }}>
            Showing {((currentPage - 1) * BILLS_PER_PAGE) + 1}-{Math.min(currentPage * BILLS_PER_PAGE, totalCount)} of {totalCount}
          </Typography>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={onPageChange}
            color="primary"
            sx={{
              '& .MuiPaginationItem-root': {
                color: colors.text.primary,
                '&.Mui-selected': {
                  backgroundColor: colors.primary,
                  color: colors.text.white,
                  '&:hover': {
                    backgroundColor: colors.primaryHover,
                  },
                },
                '&:hover': {
                  backgroundColor: colors.primaryLight,
                },
              },
            }}
          />
        </Box>
      )}
    </>
  );
}

