"use client";
import * as React from 'react';
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  Link,
} from '@mui/material';
import ResponsiveAppBar from '@/app/components/ResponsiveAppBar';
import Footer from '@/app/components/Footer';
import { colors } from '@/app/theme/colors';

// Team data
const teamMembers = [
  {
    name: "Suresh Venkatasubramanian",
    role: "Director of the Center for Technological Responsibility, Reimagination, and Redesign, Professor of Data Science and Computer Science",
    image: "/suresh.jpg",
    email: "suresh_venkatasubramanian@brown.edu",
  },
  {
    name: "Tomo Lazovich",
    role: "Assistant Professor of the Practice, AI Governance and Policy, CNTR AISLE Policy Director",
    image: "/tomo.png",
    email: "tomo_lazovich@brown.edu",
  },
  {
    name: "Meredith Mendola",
    role: "CNTR Program Manager, CNTR AISLE Product Director, SRCH: Accessibility and Product Advisor",
    image: "/Meredith-25.jpeg",
    email: "meredith_mendola@brown.edu",
  },
  {
    name: "Tuan Pham",
    role: "Former Research Associate in Neuroscience, Current PhD Student at Virginia Tech",
    image: "/tuan.png",
    email: "tuanhpham@brown.edu",
  },
  {
    name: "Grace Zhong",
    role: "Undergraduate Student in English and Mathematics, CNTR AISLE Project Manager & Scrum Master",
    image: "/grace.jpg",
    email: "ruoxi_zhong@brown.edu",
  },
  {
    name: "Laurence Nunes",
    role: "Undergraduate Student in Behavioral Decision Sciences, CNTR AISLE Product Owner",
    image: "/laurence.png",
    email: "laurence_nunes@brown.edu",
  },
  {
    name: "Navyaa Jain",
    role: "Undergraduate Student, CNTR AISLE Research Coordinator",
    image: "/navyaa.jpg",
    email: "navyaa_jain@brown.edu",
  },
  {
    name: "Timothy Fong",
    role: "Undergraduate Student in Computer Science and Mathematics, CNTR AISLE Research Analyst",
    image: "/timothy.png",
    email: "timothy_fong@brown.edu",
  },
  {
    name: "Jo Gasior-Kavishe",
    role: "Undergraduate Student in Computer Science & International and Public Affairs, CNTR AISLE Research Analyst, SRCH: AI Team Lead Fall '25, SRCH: AI Research Team '24-'25",
    image: "/jo.jpg",
    email: "jo_kavishe@brown.edu",
  },
  {
    name: "Natalia Riley",
    role: "Undergraduate Student in International and Public Affairs, CNTR AISLE Policy Analyst",
    image: "/natalia.jpg",
    email: "natalia_riley@brown.edu",
  },
  {
    name: "Jaehee Jung",
    role: "Undergraduate Student in Computer Science & Political Science, CNTR AISLE Policy Analyst",
    image: "/jamie.jpg",
    email: "jaehee_jung@brown.edu",
  },
  {
    name: "Havi Nguyen",
    role: "Undergraduate Student in Computer Science, CNTR AISLE Product Designer",
    image: "/havi.jpg",
    email: "havi_nguyen@brown.edu",
  },
  {
    name: "Vivian Wang",
    role: "Undergraduate Student in Computer Science and Cognitive Science, CNTR AISLE Product Designer",
    image: "/vivian.png",
    email: "vivian_z_wang@brown.edu",
  },
  {
    name: "Brandon Sun",
    role: "Undergraduate Student in Computer Science and Mathematics, CNTR AISLE Product Developer",
    image: "/brandon.jpg",
    email: "brandon_sun1@brown.edu",
  },
  {
    name: "Justin Park",
    role: "Undergraduate Student in Computer Science and Mathematics, CNTR AISLE Product Developer",
    image: "/justin.jpg",
    email: "jeonghyeok_park@brown.edu",
  },
  {
    name: "Wennie Jian",
    role: "",
    email: "",
  },
];

// Team Section Component
function TeamSection() {
  return (
    <Box sx={{ pb: 6, minHeight: '100vh', pt: 0, mt: 0 }}>
      <Container maxWidth="lg">
        <Typography
          variant="h4"
          component="h1"
          sx={{
            textAlign: 'center',
            mb: 2,
            fontWeight: 'bold',
            color: colors.text.primary,
            pt: 4,
          }}
        >
          Our Team
        </Typography>

        <Typography
          variant="body1"
          sx={{
            textAlign: 'center',
            mb: 6,
            color: colors.text.secondary,
          }}
        >
          CNTR AISLE is a collaborative effort of students, researchers, and faculty members.
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
                    backgroundImage: member.image ? `url(${member.image})` : 'none',
                    backgroundSize: 'cover',
                    backgroundColor: colors.border.light,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: colors.text.secondary,
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
                    color: colors.text.primary,
                  }}
                >
                  {member.name}
                </Typography>
                <Typography
                  variant="subtitle1"
                  sx={{
                    mb: 1.5,
                    color: colors.primary,
                  }}
                >
                  {member.role}
                </Typography>
                {member.email && (
                  <Link
                    href={`mailto:${member.email}`}
                    sx={{
                      color: colors.status.info,
                      textDecoration: 'underline',
                      fontSize: '0.875rem',
                      '&:hover': {
                        color: colors.primary,
                      },
                    }}
                  >
                    {member.email}
                  </Link>
                )}
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

// Main Page Component
export default function OurTeamPage() {
  return (
    <Box sx={{ backgroundColor: colors.background.main, minHeight: '100vh' }}>
      <ResponsiveAppBar />
      <TeamSection />
      <Footer />
    </Box>
  );
}

