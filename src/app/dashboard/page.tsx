"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/firebase';
import { userService } from '@/backend/users';
import { databaseService } from '@/backend/database';
import { onAuthStateChanged } from 'firebase/auth';
import ResponsiveAppBar from '@/app/components/ResponsiveAppBar';
import Footer from '@/app/components/Footer';
import Loading from '@/app/components/Loading';
import BillBox from '@/app/components/BillBox';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

type FilterType = 'all' | 'inProgress' | 'assigned' | 'scored';

interface BillData {
  id: string;
  name: string;
  date: string;
  description: string;
  status: 'inProgress' | 'assigned' | 'scored';
  billIdentifier: string; // format is "NY S6953" (state + type + number)
}

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [bills, setBills] = useState<BillData[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    assigned: 0,
    scored: 0,
    inProgress: 0,
  });
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    billId: '',
    billName: '',
  });
  const [alertDialog, setAlertDialog] = useState({
    open: false,
    message: '',
  });
  const [expandedBills, setExpandedBills] = useState<Set<string>>(new Set());

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push('/signin');
      } else {
        await loadUserBills(user.uid);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [router]);

  const loadUserBills = async (uid: string) => {
    try {
      const user = await userService.getUser(uid);
      if (!user) return;
      const allBills = await databaseService.getAllBills();
      const billsData: BillData[] = [];
      
      // Creating Bill Data Entry
      const createBillData = (bill: any, status: 'inProgress' | 'assigned' | 'scored'): BillData => {
        const billIdShort = `${bill.state} ${bill.number || ''}`;
        return {
          id: bill.billId,
          name: billIdShort, // title right now is just state + number, can change later?
          date: bill.versionDate,
          description: bill.description || bill.title || bill.name || 'No description available',
          status,
          billIdentifier: billIdShort,
        };
      };
      
      // completed bill ids to exclude from in-progress
      const completedBillIds = user.completedBills ? Object.keys(user.completedBills) : [];
      
      // Add in-progress bill if it exists and it's not already completed
      if (user.inProgress && !completedBillIds.includes(user.inProgress.billId)) {
        const bill = allBills.find(b => b.billId === user.inProgress!.billId);
        if (bill) {
          billsData.push(createBillData(bill, 'inProgress'));
        }
      }

      // add completed bills
      if (user.completedBills && Object.keys(user.completedBills).length > 0) {
        Object.keys(user.completedBills).forEach((billId) => {
          const bill = allBills.find(b => b.billId === billId);
          if (bill) {
            billsData.push(createBillData(bill, 'scored'));
          }
        });
      }

      // add assigned bills (from user.assignedBills)
      if (user.assignedBills && user.assignedBills.length > 0) {
        user.assignedBills.forEach((billId) => {
          // Only add if not already in progress or completed
          if (!billsData.find((b) => b.id === billId)) {
            const bill = allBills.find(b => b.billId === billId);
            if (bill) {
              billsData.push(createBillData(bill, 'assigned'));
            }
          }
        });
      }

      // TEMPORARY FIX WILL CHANGE: For now just show 10 random bills as demo (different per user)
      // TODO: Remove this when we make bill assignment work properly
      const hasRealAssignedBills = user.assignedBills && user.assignedBills.length > 0;
      
      // If no real assigned bills, show 10 random bills as demo (different per user)
      if (!hasRealAssignedBills && allBills.length > 0) {
        // each user always sees the same 10 random bills
        const seed = uid.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        
        // Filter out bills already in billsData
        const availableBills = allBills.filter(bill => 
          !billsData.find(b => b.id === bill.billId)
        );
        
        // Simple seeded random function for consistent selection per user
        let randomSeed = seed;
        const seededRandom = () => {
          randomSeed = (randomSeed * 9301 + 49297) % 233280;
          return randomSeed / 233280;
        };
        
        // Shuffle available bills using seeded random
        const shuffled = [...availableBills].sort(() => seededRandom() - 0.5);
        
        // Take first 10 bills
        const randomBills = shuffled.slice(0, 10);
        
        randomBills.forEach((bill) => {
          billsData.push(createBillData(bill, 'assigned'));
        });
      }
      //END OF TEMPORARY CAN REMOVE UNTIL HERE LATER

      setBills(billsData);

      // Calculate stats
      const inProgressCount = billsData.filter(b => b.status === 'inProgress').length;
      const assignedCount = billsData.filter(b => b.status === 'assigned').length;
      const scoredCount = billsData.filter(b => b.status === 'scored').length;
      
      setStats({
        total: billsData.length,
        inProgress: inProgressCount,
        assigned: assignedCount,
        scored: scoredCount,
      });
    } catch (error: any) {
      console.error('Error loading user bills:', error);
      setAlertDialog({
        open: true,
        message: `Failed to load bills: ${error?.message || 'Unknown error'}.`
      });
      setBills([]);
      setStats({ total: 0, inProgress: 0, assigned: 0, scored: 0 });
    }
  };

  const filteredBills = bills.filter((bill) => {
    const matchesFilter = filter === 'all' || bill.status === filter;
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      bill.name.toLowerCase().includes(searchLower) ||
      bill.description.toLowerCase().includes(searchLower) ||
      bill.billIdentifier.toLowerCase().includes(searchLower);
    return matchesFilter && matchesSearch;
  });

  const handleContinue = (billId: string) => {
    router.push(`/scorecard?bill=${encodeURIComponent(billId)}`);
  };

  const handleScoreBill = async (billId: string) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        router.push('/signin');
        return;
      }

      // Check if user already has a bill in progress (and it's not already completed)
      const userData = await userService.getUser(user.uid);
      if (userData?.inProgress) {
        const completedBillIds = userData.completedBills ? Object.keys(userData.completedBills) : [];
        // If the in-progress bill is already completed, clear it and allow starting a new one
        if (completedBillIds.includes(userData.inProgress.billId)) {
          // Clear the stale inProgress data
          await databaseService.clearUserProgress(user.uid);
        } else {
          // Bill is actually in progress, show error
          setAlertDialog({
            open: true,
            message: 'You already have a bill in progress. Please complete it before starting another one.',
          });
          return;
        }
      }

      // Get bill name for confirmation
      const allBills = await databaseService.getAllBills();
      const bill = allBills.find(b => b.billId === billId);
      const billName = bill?.name || billId;

      // Show confirmation dialog
      setConfirmDialog({
        open: true,
        billId,
        billName,
      });
    } catch (error) {
      setAlertDialog({
        open: true,
        message: 'Failed to start bill. Please try again.',
      });
    }
  };

  const confirmStartBill = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        router.push('/signin');
        return;
      }

      const { billId } = confirmDialog;

      // Start the bill by creating in-progress entry
      await databaseService.updateUserProgress(
        user.uid,
        billId,
        {},
        {},
        {},
        'general'
      );

      // Close dialog
      setConfirmDialog({ open: false, billId: '', billName: '' });

      // Reload the bills to show updated status
      await loadUserBills(user.uid);
      
      // Navigate to scorecard with this bill
      router.push(`/scorecard?bill=${encodeURIComponent(billId)}`);
    } catch (error) {
      setAlertDialog({
        open: true,
        message: 'Failed to start bill. Please try again.',
      });
    }
  };

  const handleViewBill = async (billId: string) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        router.push('/signin');
        return;
      }

      // Get the submission ID from completed bills
      const userData = await userService.getUser(user.uid);
      const submissionId = userData?.completedBills?.[billId];
      
      if (!submissionId) {
        setAlertDialog({
          open: true,
          message: 'Submission not found for this bill.',
        });
        return;
      }

      // Navigate to view page with submission ID
      router.push(`/scorecard/view?submission=${encodeURIComponent(submissionId)}`);
    } catch (error) {
      setAlertDialog({
        open: true,
        message: 'Failed to load submission. Please try again.',
      });
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#F6FBF7' }}>
      <ResponsiveAppBar />
      <Container maxWidth={false} sx={{ py: 4, px: 4 }}>
        <Typography
          variant="h4"
          sx={{
            fontFamily: 'Rubik-Bold',
            fontWeight: 'bold',
            mb: 3,
            color: '#333',
          }}
        >
          Your Bill Dashboard
        </Typography>

        {/* Search and Filter */}
        <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap', maxWidth: '1200px', mx: 'auto' }}>
          <TextField
            placeholder="Search bills"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{
              flexGrow: 1,
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'white',
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <Box sx={{ display: 'flex', gap: 1 }}>
            {(['all', 'inProgress', 'assigned', 'scored'] as FilterType[]).map((f) => (
              <Button
                key={f}
                variant={filter === f ? 'contained' : 'outlined'}
                onClick={() => setFilter(f)}
                sx={{
                  fontFamily: 'Rubik',
                  backgroundColor: filter === f ? '#0C6431' : 'transparent',
                  color: filter === f ? 'white' : '#0C6431',
                  borderColor: '#0C6431',
                  textTransform: 'capitalize',
                  '&:hover': {
                    backgroundColor: filter === f ? '#094d26' : 'rgba(12, 100, 49, 0.1)',
                  },
                }}
              >
                {f === 'inProgress' ? 'In Progress' : f}
              </Button>
            ))}
          </Box>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={2} sx={{ mb: 4, maxWidth: '1200px', mx: 'auto' }}>
          <Grid size={{ xs: 4, sm: 4 }}>
            <Card sx={{ backgroundColor: 'white', boxShadow: '0px 1px 3px rgba(0,0,0,0.1)' }}>
              <CardContent sx={{ py: 2 }}>
                <Typography variant="body2" sx={{ fontFamily: 'Rubik', color: '#666', fontSize: '0.875rem' }}>
                  Total Bills
                </Typography>
                <Typography sx={{ fontFamily: 'Rubik-Bold', color: '#0C6431', fontSize: '2rem', mt: 0.5 }}>
                  {stats.total}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 4, sm: 4 }}>
            <Card sx={{ backgroundColor: 'white', boxShadow: '0px 1px 3px rgba(0,0,0,0.1)' }}>
              <CardContent sx={{ py: 2 }}>
                <Typography variant="body2" sx={{ fontFamily: 'Rubik', color: '#666', fontSize: '0.875rem' }}>
                  Assigned
                </Typography>
                <Typography sx={{ fontFamily: 'Rubik-Bold', color: '#0C6431', fontSize: '2rem', mt: 0.5 }}>
                  {stats.assigned}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 4, sm: 4 }}>
            <Card sx={{ backgroundColor: 'white', boxShadow: '0px 1px 3px rgba(0,0,0,0.1)' }}>
              <CardContent sx={{ py: 2 }}>
                <Typography variant="body2" sx={{ fontFamily: 'Rubik', color: '#666', fontSize: '0.875rem' }}>
                  Scored
                </Typography>
                <Typography sx={{ fontFamily: 'Rubik-Bold', color: '#0C6431', fontSize: '2rem', mt: 0.5 }}>
                  {stats.scored}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Bill Cards - Grouped by Status */}
        {(() => {
          const inProgressBills = filteredBills.filter(b => b.status === 'inProgress');
          const assignedBills = filteredBills.filter(b => b.status === 'assigned');
          const scoredBills = filteredBills.filter(b => b.status === 'scored');


          return (
            <Box sx={{ maxWidth: '1200px', mx: 'auto' }}>
              {inProgressBills.length > 0 && (
                <Grid container spacing={3} sx={{ mb: 5 }}>
                  {inProgressBills.map((bill) => (
                    <BillBox
                      key={bill.id}
                      bill={bill}
                      isInProgress={true}
                      onContinue={handleContinue}
                      onScoreBill={handleScoreBill}
                      onViewBill={handleViewBill}
                      expandedBills={expandedBills}
                      setExpandedBills={setExpandedBills}
                    />
                  ))}
                </Grid>
              )}

              {/* Assigned Section */}
              {assignedBills.length > 0 && (
                <Box sx={{ mb: 5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontFamily: 'Rubik-Bold',
                        color: '#333',
                        fontSize: '1.25rem',
                      }}
                    >
                      Assigned
                    </Typography>
                  </Box>
                  <Grid container spacing={3}>
                    {assignedBills.map((bill) => (
                      <BillBox
                        key={bill.id}
                        bill={bill}
                        isInProgress={false}
                        onContinue={handleContinue}
                        onScoreBill={handleScoreBill}
                        onViewBill={handleViewBill}
                        expandedBills={expandedBills}
                        setExpandedBills={setExpandedBills}
                      />
                    ))}
                  </Grid>
                </Box>
              )}

              {/* Scored Section */}
              {scoredBills.length > 0 && (
                <Box sx={{ mb: 5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontFamily: 'Rubik-Bold',
                        color: '#333',
                        fontSize: '1.25rem',
                      }}
                    >
                      Scored
                    </Typography>
                  </Box>
                  <Grid container spacing={3}>
                    {scoredBills.map((bill) => (
                      <BillBox
                        key={bill.id}
                        bill={bill}
                        isInProgress={false}
                        onContinue={handleContinue}
                        onScoreBill={handleScoreBill}
                        onViewBill={handleViewBill}
                        expandedBills={expandedBills}
                        setExpandedBills={setExpandedBills}
                      />
                    ))}
                  </Grid>
                </Box>
              )}

              {filteredBills.length === 0 && (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <Typography variant="h6" sx={{ fontFamily: 'Rubik', color: '#666' }}>
                    No bills found
                  </Typography>
                </Box>
              )}
            </Box>
          );
        })()}
      </Container>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ open: false, billId: '', billName: '' })}
      >
        <DialogTitle sx={{ fontFamily: 'Rubik-Bold' }}>
          Start Scoring Bill
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ fontFamily: 'Rubik', color: '#333' }}>
            Are you sure you want to start scoring "{confirmDialog.billName}"?
            <br /><br />
            <strong>Important:</strong> To score another bill, you must first complete this bill.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setConfirmDialog({ open: false, billId: '', billName: '' })}
            sx={{ fontFamily: 'Rubik' }}
          >
            Cancel
          </Button>
          <Button
            onClick={confirmStartBill}
            variant="contained"
            sx={{
              fontFamily: 'Rubik',
              backgroundColor: '#0C6431',
              '&:hover': { backgroundColor: '#094d26' },
            }}
          >
            Start Bill
          </Button>
        </DialogActions>
      </Dialog>

      {/* Alert Dialog */}
      <Dialog
        open={alertDialog.open}
        onClose={() => setAlertDialog({ open: false, message: '' })}
      >
        <DialogTitle sx={{ fontFamily: 'Rubik-Bold' }}>
          Bill Already In Progress
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ fontFamily: 'Rubik', color: '#333' }}>
            {alertDialog.message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setAlertDialog({ open: false, message: '' })}
            variant="contained"
            sx={{
              fontFamily: 'Rubik',
              backgroundColor: '#0C6431',
              '&:hover': { backgroundColor: '#094d26' },
            }}
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>

      <Footer />
    </Box>
  );
}

