import { Card, CardContent, Typography, Grid } from '@mui/material';
import { colors } from '@/app/theme/colors';
import { DashboardStats as Stats } from './useDashboardData';

interface DashboardStatsProps {
  stats: Stats;
}

export default function DashboardStats({ stats }: DashboardStatsProps) {
  const statCards = [
    { label: 'Total Bills', value: stats.total },
    { label: 'Assigned/In Progress', value: stats.assigned },
    { label: 'Scored', value: stats.scored },
  ];

  return (
    <Grid container spacing={2} sx={{ mb: 4, maxWidth: '1200px', mx: 'auto' }}>
      {statCards.map((stat) => (
        <Grid key={stat.label} size={{ xs: 4, sm: 4 }}>
          <Card
            sx={{
              backgroundColor: colors.background.white,
              boxShadow: '0px 1px 3px rgba(0,0,0,0.1)',
            }}
          >
            <CardContent sx={{ py: 2 }}>
              <Typography
                variant="body2"
                sx={{ color: colors.text.secondary, fontSize: '0.875rem' }}
              >
                {stat.label}
              </Typography>
              <Typography
                sx={{ color: colors.primary, fontSize: '2.5rem', mt: 0.5 }}
              >
                {stat.value}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
