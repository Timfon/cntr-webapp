"use client";
import * as React from 'react';
import { 
  AppBar, 
  Box, 
  Toolbar, 
  IconButton, 
  Typography, 
  Menu, 
  Container, 
  Avatar, 
  Button, 
  Tooltip, 
  MenuItem,
  Grid,
  Card,
  CardContent,
  Paper
} from '@mui/material';
import ResponsiveAppBar from '@/components/ResponsiveAppBar';
import Footer from '@/components/Footer';
import { useRouter } from 'next/navigation';
import "@fontsource/rubik";
import MenuIcon from '@mui/icons-material/Menu';
import AdbIcon from '@mui/icons-material/Adb';


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

// function ResponsiveAppBar() {
//   const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
//   const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

//   const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
//     setAnchorElNav(event.currentTarget);
//   };
//   const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
//     setAnchorElUser(event.currentTarget);
//   };

//   const handleCloseNavMenu = () => {
//     setAnchorElNav(null);
//   };

//   const handleCloseUserMenu = () => {
//     setAnchorElUser(null);
//   };

//   return (
//     <AppBar position="static" sx={{ backgroundColor: '#FFFFFF' }}>
//       <Container maxWidth="xl">
//         <Toolbar disableGutters>
//           <Avatar 
//             src="/cntr_logo.png"
//             alt="Logo"
//             sx={{ 
//               display: { xs: 'none', md: 'flex' }, 
//               mr: 1,
//               width: 50,
//               height: 50
//             }} 
//           />
//           <Typography
//             variant="h6"
//             noWrap
//             component="a"
//             href="#app-bar-with-responsive-menu"
//             sx={{
//               mr: 2,
//               display: { xs: 'none', md: 'flex' },
//               fontFamily: "Rubik-ExtraBold",
//               fontWeight: '900',
//               letterSpacing: '.1rem',
//               color: '#0C6431',
//               textDecoration: 'none',
//             }}
//           >
//             CNTR AISLE
//           </Typography>
          
//           <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
//             <IconButton
//               size="large"
//               aria-label="account of current user"
//               aria-controls="menu-appbar"
//               aria-haspopup="true"
//               onClick={handleOpenNavMenu}
//               color="inherit"
//             >
//               <MenuIcon />
//             </IconButton>
//             <Menu
//               id="menu-appbar"
//               anchorEl={anchorElNav}
//               anchorOrigin={{
//                 vertical: 'bottom',
//                 horizontal: 'left',
//               }}
//               keepMounted
//               transformOrigin={{
//                 vertical: 'top',
//                 horizontal: 'left',
//               }}
//               open={Boolean(anchorElNav)}
//               onClose={handleCloseNavMenu}
//               sx={{ display: { xs: 'block', md: 'none' } }}
//             >
//               {pages.map((page) => (
//                 <MenuItem key={page} onClick={handleCloseNavMenu}>
//                   <Typography sx={{ textAlign: 'center' }}>{page}</Typography>
//                 </MenuItem>
//               ))}
//             </Menu>
//           </Box>
//           <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />

//           <Typography
//             variant="h5"
//             noWrap
//             component="a"
//             href="#app-bar-with-responsive-menu"
//             sx={{
//               mr: 2,
//               display: { xs: 'flex', md: 'none' },
//               flexGrow: 1,
//               fontFamily: 'Rubik',
//               fontWeight: 700,
//               letterSpacing: '.3rem',
//               color: '#0C6431',
//               textDecoration: 'none',
//             }}
//           >
//             LOGO
//           </Typography>
//           <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
//             {pages.map((page) => (
//               <Button
//                 key={page}
//                 onClick={handleCloseNavMenu}
//                 sx={{ fontFamily: 'Rubik', my: 2, color: '#0C6431', display: 'block' }}
//               >
//                 {page}
//               </Button>
//             ))}
//           </Box>
//           <Box sx={{ flexGrow: 0 }}>
//             <Tooltip title="Open settings">
//               <IconButton onClick={handleOpenUserMenu} sx={{ p: 0, width: 40, height: 40 }}>
//                 <Avatar alt="User" src="/user_icon.png" sx={{width: 30, height: 30}}/>
//               </IconButton>
//             </Tooltip>
//             <Menu
//               sx={{ mt: '45px' }}
//               id="menu-appbar"
//               anchorEl={anchorElUser}
//               anchorOrigin={{
//                 vertical: 'top',
//                 horizontal: 'right',
//               }}
//               keepMounted
//               transformOrigin={{
//                 vertical: 'top',
//                 horizontal: 'right',
//               }}
//               open={Boolean(anchorElUser)}
//               onClose={handleCloseUserMenu}
//             >
//               {settings.map((setting) => (
//                 <MenuItem key={setting} onClick={handleCloseUserMenu}>
//                   <Typography sx={{ textAlign: 'center' }}>{setting}</Typography>
//                 </MenuItem>
//               ))}
//             </Menu>
//           </Box>
//         </Toolbar>
//       </Container>
//     </AppBar>
//   );
// }

// Hero Section Component
function HeroSection() {
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
            The mission of the Center is to redefine computer science education, research, and technology to center the needs, problems, and aspirations of all — and especially those that technology has left behind.
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
            The mission of the Center is to redefine computer science education, research, and technology to center the needs, problems, and aspirations of all — and especially those that technology has left behind. The mission of the Center is to redefine computer science education, research, and technology to center the needs, problems, and aspirations of all — and especially those that technology has left behind.
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
            Sign Up
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

//Footer Component
// function Footer() {
//   return (
//     <Box sx={{ backgroundColor: '#07361B', color: 'white', py: 6 }}>
//       <Container maxWidth="lg">
//         <Grid container spacing={4}>
//           <Grid size={{ xs: 12, md: 6 }}>
//             <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
//               <Avatar
//                 src="/cntr_logo.png"
//                 alt="Logo"
//                 sx={{ width: 40, height: 40, mr: 2 }}
//               />
//               <Typography
//                 variant="h6"
//                 sx={{
//                   fontFamily: 'Rubik',
//                   fontWeight: 'bold',
//                 }}
//               >
//                 Center for Technological Responsibility, Reimagination, and Redesign (CNTR)
//               </Typography>
//             </Box>
//             <Typography
//               variant="body2"
//               sx={{
//                 mb: 1,
//                 fontFamily: 'Rubik',
//               }}
//             >
//               Brown University
//             </Typography>
//             <Typography
//               variant="body2"
//               sx={{
//                 mb: 1,
//                 fontFamily: 'Rubik',
//               }}
//             >
//               Providence, RI 02912
//             </Typography>
//             <Typography
//               variant="body2"
//               sx={{
//                 mb: 1,
//                 fontFamily: 'Rubik',
//               }}
//             >
//               401-863-1000
//             </Typography>
//             <Typography
//               variant="body2"
//               sx={{
//                 fontFamily: 'Rubik',
//               }}
//             >
//                © Brown University 2025
//             </Typography>

            
            
            
//           </Grid>
//         </Grid>
//       </Container>
//     </Box>
//   );
// }

// Main App Component
function App() {
  return (
    <Box>
      <ResponsiveAppBar />
      <HeroSection />
      <AboutSection />
      <TeamSection />
      <Footer />
    </Box>
  );
}

export default App;