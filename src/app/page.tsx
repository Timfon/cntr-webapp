"use client";
import { 
  Box, 
  Typography, 
  Container, 
  Button, 
  Grid,
} from '@mui/material';
import ResponsiveAppBar from '@/app/components/ResponsiveAppBar';
import Footer from '@/app/components/Footer';
import { useRouter } from 'next/navigation';
import "@fontsource/rubik";


// Hero Section Component
function HeroSection() {
  const router = useRouter();
  
  return (
    <Box
      sx={{
        backgroundImage: 'url(/hero.jpg)', // Replace with your background image
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '60vh',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(8px)',
        }
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Typography
          variant="h2"
          component="h1"
          sx={{
            color: 'white',
            fontWeight: 'bold',
            mb: 2,
          }}
        >
          CNTR AISLE
        </Typography>
        <Typography
          variant="h6"
          sx={{
            color: 'white',
            mb: 4,
            maxWidth: '600px',
          }}
        >
          We reimagine how to design, build and govern technology in ways that put people first.
        </Typography>
        <Button
          variant="contained"
          onClick={() => router.push('/signin')}
          sx={{
            backgroundColor: '#0C6431',
            color: 'white',
            px: 3,
            py: 1.2,
            fontSize: '1rem',
            fontWeight: 'bold',
            '&:hover': {
              backgroundColor: '#094d26',
            },
          }}
        >
          Sign In
        </Button>
      </Container>
    </Box>
  );
}

// About Section Component
function AboutSection() {
  const router = useRouter();
  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Grid container spacing={4} alignItems="center">
        <Grid size={{ xs: 12, md: 6 }} order={{ xs: 2, md: 1 }}>
          <Typography
            variant="h4"
            component="h2"
            sx={{
              mb: 4,
              fontWeight: 'bold',
              color: '#333',
            }}
          >
            More About CNTR AISLE
          </Typography>
          
          <Typography
            variant="body1"
            sx={{
              mb: 3,
              lineHeight: 1.6,
              color: '#666',
            }}
          >
            Over 1,000 AI-related bills were introduced in the US from January 2023 to January 2025. With a lack of efforts to identify key policy elements that assess the maturity and robustness of AI legislation, a comprehensive assessment framework is urgently needed for policymakers, media, and the public.
          </Typography>
          
          <Typography
            variant="body1"
            sx={{
              mb: 4,
              lineHeight: 1.6,
              color: '#666',
            }}
          >
            The mission of the Center is to redefine computer science education, research, and technology to center the needs, problems, and aspirations of all — and especially those that technology has left behind.
          </Typography>

          


          <Button
            variant="contained"
            onClick={() => router.push('/signin')}
            sx={{
              backgroundColor: '#0C6431',
              color: 'white',
              px: 3,
              py: 1.0,
              '&:hover': {
                backgroundColor: '#094d26',
              },
            }}
          >
            Sign In
          </Button>
        </Grid>
        
        <Grid size={{ xs: 12, md: 6 }} order={{ xs: 1, md: 2 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '400px',
            }}
          >
            <Box
  sx={{
    width: '100%',
    maxWidth: '400px',
    height: '300px',
    backgroundImage: 'url(/loGO.png)',
    backgroundColor: '#f0f0f0',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover', // or 'cover', depending on how you want it to scale
    borderRadius: '20px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#666',
  }}
>
</Box>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}

// Main App Component
function App() {
  return (
    <Box sx={{ backgroundColor: '#ffffff', minHeight: '100vh' }}>
      <ResponsiveAppBar />
      <HeroSection />
      <AboutSection />
      <Footer />
    </Box>
  );
}

export default App;