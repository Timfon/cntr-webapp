"use client";
import * as React from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Button, 
  Grid,
  Card,
} from '@mui/material';
import ResponsiveAppBar from '@/components/ResponsiveAppBar';
import Footer from '@/components/Footer';
import { useRouter } from 'next/navigation';
import "@fontsource/rubik";


// Sample team data
const teamMembers = [
  {
    name: "Suresh Venkatasubramanian",
    role: "Director of the Center for Technological Responsibility, Reimagination, and Redesign, Interim Director of the Data Science Institute, Professor of Data Science and Computer Science",
    image: "/suresh.jpg", // Replace with actual image paths
    //description: "Lorem ipsum dolor sit amet. Vel totam amet ut velit rhoncus quis ante magna qui doloribus sapientes."
  },
  {
    name: "Meredith Mendola", 
    role: "CNTR Program Manager",
    image: "/Meredith-25.jpeg",
    //description: "Lorem ipsum dolor sit amet. Vel totam amet ut velit rhoncus quis ante magna qui doloribus sapientes."
  },
  {
    name: "Tuan Pham",
    role: "Research Associate in Neuroscience", 
    image: "/tuan.png",
    //description: "Lorem ipsum dolor sit amet. Vel totam amet ut velit rhoncus quis ante magna qui doloribus sapientes."
  },
  {
    name: "Sasa Jovanovic",
    role: "Policy Research Lead", 
    image: "/sasa.png",
    //description: "Lorem ipsum dolor sit amet. Vel totam amet ut velit rhoncus quis ante magna qui doloribus sapientes."
  },
  {
    name: "Fern Tantivess",
    role: "Undergraduate Research Assistant", 
    //image: "/tuan.png",
    //description: "Lorem ipsum dolor sit amet. Vel totam amet ut velit rhoncus quis ante magna qui doloribus sapientes."
  },
  {
    name: "Grace Zhong",
    role: "Undergraduate Research Assistant", 
    //image: "/tuan.png",
    //description: "Lorem ipsum dolor sit amet. Vel totam amet ut velit rhoncus quis ante magna qui doloribus sapientes."
  },
  {
    name: "Havi Nguyen",
    role: "Undergraduate Research Assistant", 
    //image: "/tuan.png",
    //description: "Lorem ipsum dolor sit amet. Vel totam amet ut velit rhoncus quis ante magna qui doloribus sapientes."
  },
  {
    name: "Jamie Jung",
    role: "Undergraduate Research Assistant", 
    //image: "/tuan.png",
    //description: "Lorem ipsum dolor sit amet. Vel totam amet ut velit rhoncus quis ante magna qui doloribus sapientes."
  },
  {
    name: "Jo Kavishe",
    role: "Undergraduate Research Assistant", 
    //image: "/tuan.png",
    //description: "Lorem ipsum dolor sit amet. Vel totam amet ut velit rhoncus quis ante magna qui doloribus sapientes."
  },
  {
    name: "Mahir Arora",
    role: "Undergraduate Research Assistant", 
    //image: "/tuan.png",
    //description: "Lorem ipsum dolor sit amet. Vel totam amet ut velit rhoncus quis ante magna qui doloribus sapientes."
  },
  {
    name: "Natalia Riley",
    role: "Undergraduate Research Assistant", 
    //image: "/tuan.png",
    //description: "Lorem ipsum dolor sit amet. Vel totam amet ut velit rhoncus quis ante magna qui doloribus sapientes."
  },
  {
    name: "Nora Cai",
    role: "Undergraduate Research Assistant", 
    //image: "/tuan.png",
    //description: "Lorem ipsum dolor sit amet. Vel totam amet ut velit rhoncus quis ante magna qui doloribus sapientes."
  },
  {
    name: "Rachel Kim",
    role: "Undergraduate Research Assistant", 
    //image: "/tuan.png",
    //description: "Lorem ipsum dolor sit amet. Vel totam amet ut velit rhoncus quis ante magna qui doloribus sapientes."
  },
  {
    name: "Timothy Fong",
    role: "Undergraduate Research Assistant", 
    //image: "/tuan.png",
    //description: "Lorem ipsum dolor sit amet. Vel totam amet ut velit rhoncus quis ante magna qui doloribus sapientes."
  },
];

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
            fontFamily: 'Rubik-ExtraBold',
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
            fontFamily: 'Rubik',
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
            fontFamily: 'Rubik',
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
              fontFamily: 'Rubik',
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
              fontFamily: 'Rubik',
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
              fontFamily: 'Rubik',
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
              fontFamily: 'Rubik',
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
    fontFamily: 'Rubik',
  }}
>
</Box>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}

// Team Section Component
function TeamSection() {
  return (
    <Box sx={{ backgroundColor: '#f5f5f5', py: 8 }}>
      <Container maxWidth="lg">
        <Typography
          variant="h4"
          component="h2"
          sx={{
            textAlign: 'center',
            mb: 6,
            fontWeight: 'bold',
            color: '#333',
            fontFamily: 'Rubik',
          }}
        >
          Our Team
        </Typography>
        
        <Grid container spacing={4}>
          {teamMembers.map((member, index) => (
            <Grid size={{ xs: 12, md: 4 }} key={index}>
              <Card
                sx={{
                  textAlign: 'center',
                  p: 3,
                  height: '100%',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                  },
                }}
              >
                <Box
                  sx={{
                    width: 100,
                    height: 100,
                    mx: 'auto',
                    mb: 2,
                    backgroundImage: `url(${member.image})`,
                    backgroundSize: 'cover',
                    backgroundColor: '#e0e0e0',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#666',
                    fontFamily: 'Rubik',
                    fontSize: '12px',
                  }}
                >
                </Box>
                <Typography
                  variant="h6"
                  component="h3"
                  sx={{
                    mb: 1,
                    fontWeight: 'bold',
                    color: '#333',
                    fontFamily: 'Rubik',
                  }}
                >
                  {member.name}
                </Typography>
                <Typography
                  variant="subtitle1"
                  sx={{
                    mb: 2,
                    color: '#0C6431',
                    fontFamily: 'Rubik',
                  }}
                >
                  {member.role}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#666',
                    lineHeight: 1.5,
                    fontFamily: 'Rubik',
                  }}
                >
                  {/* {member.description} */}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

// Main App Component
function App() {
  return (
    <Box sx={{ backgroundColor: '#ffffff', minHeight: '100vh' }}>
      <ResponsiveAppBar />
      <HeroSection />
      <AboutSection />
      <TeamSection />
      <Footer />
    </Box>
  );
}

export default App;