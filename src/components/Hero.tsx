import { Container, Title, Text, Box, Group, Button } from '@mantine/core';
import { IconBrandGithub, IconBrandLinkedin, IconMail } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { getPersonalInfo, type PersonalInfo } from '../services/api';
import { motion } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import type { CSSProperties } from 'react';

const MotionBox = motion(Box as any);
const MotionTitle = motion(Title as any);
const MotionText = motion(Text as any);
const MotionGroup = motion(Group as any);

const fadeInUp = {
  initial: { 
    y: 30, 
    opacity: 0 
  },
  animate: { 
    y: 0, 
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: [0.43, 0.13, 0.23, 0.96]
    }
  }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
};

const buttonHoverAnimation = {
  scale: 1.05,
  y: -5,
  transition: { 
    duration: 0.2,
    ease: "easeOut"
  }
};

const buttonTapAnimation = {
  scale: 0.95,
  y: 0
};

const glowingButtonVariants = {
  initial: { 
    scale: 0.9, 
    opacity: 0,
    background: 'linear-gradient(45deg, #3b82f6 30%, #60a5fa 90%)'
  },
  animate: { 
    scale: 1, 
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: [0.43, 0.13, 0.23, 0.96]
    }
  },
  hover: { 
    ...buttonHoverAnimation,
    boxShadow: '0 0 30px rgba(59,130,246,0.7)'
  },
  tap: buttonTapAnimation
};

const outlineButtonVariants = {
  initial: { 
    scale: 0.9, 
    opacity: 0 
  },
  animate: { 
    scale: 1, 
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: [0.43, 0.13, 0.23, 0.96]
    }
  },
  hover: { 
    ...buttonHoverAnimation,
    boxShadow: '0 0 30px rgba(148,251,255,0.3)',
    background: 'rgba(148,251,255,0.1)'
  },
  tap: buttonTapAnimation
};

const socialButtonVariants = {
  initial: { 
    scale: 0.9, 
    opacity: 0 
  },
  animate: { 
    scale: 1, 
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: [0.43, 0.13, 0.23, 0.96]
    }
  },
  hover: { 
    y: -3,
    boxShadow: '0 10px 20px rgba(148,251,255,0.1)',
    background: 'rgba(148,251,255,0.1)'
  },
  tap: { 
    y: 0,
    scale: 0.95
  }
};

const glowingButton: CSSProperties = {
  position: 'relative' as const,
  overflow: 'visible' as const,
  background: 'linear-gradient(45deg, #3b82f6 30%, #60a5fa 90%)',
  fontSize: '1.125rem',
  padding: '1.25rem 2.5rem',
  border: 'none',
  boxShadow: '0 0 20px rgba(59,130,246,0.5)',
  whiteSpace: 'nowrap',
  minWidth: 'max-content',
  lineHeight: '1.5',
  height: 'auto',
  minHeight: '3.5rem',
} as const;

const outlineButton: CSSProperties = {
  color: '#94FBFF',
  borderColor: '#94FBFF',
  fontSize: '1.125rem',
  padding: '1.25rem 2.5rem',
  background: 'rgba(148,251,255,0.05)',
  backdropFilter: 'blur(10px)',
  transition: 'all 0.3s ease',
  whiteSpace: 'nowrap',
  minWidth: 'max-content',
  lineHeight: '1.5',
  height: 'auto',
  minHeight: '3.5rem',
} as const;

const socialButton: CSSProperties = {
  color: '#94FBFF',
  fontSize: '1.1rem',
  background: 'rgba(148,251,255,0.05)',
  backdropFilter: 'blur(10px)',
  padding: '0.8rem 1.5rem',
  transition: 'all 0.3s ease',
  whiteSpace: 'nowrap',
  minWidth: 'max-content',
  lineHeight: '1.5',
  height: 'auto',
  minHeight: '3rem',
} as const;

export function Hero() {
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    name: '',
    title: '',
    bio: '',
    email: '',
    githubUrl: '',
    linkedinUrl: '',
    heroTitles: [],
    heroSubtitles: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPersonalInfo = async () => {
      try {
        const data = await getPersonalInfo();
        setPersonalInfo(data);
      } catch (error) {
        console.error('Error fetching personal info:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPersonalInfo();
  }, []);

  if (loading) {
    return (
      <Box pos="relative" h={400} style={{ background: '#1a1b1e' }}>
        <Text ta="center" pt={180} c="dimmed" size="xl">جاري التحميل...</Text>
      </Box>
    );
  }

  return (
    <MotionBox
      style={{
        background: 'linear-gradient(135deg, #1a1b1e 0%, #2C2E33 100%)',
        color: 'white',
        paddingTop: 120,
        paddingBottom: 120,
        position: 'relative',
        overflow: 'hidden'
      }}
      initial="initial"
      animate="animate"
      variants={staggerContainer}
    >
      <Container size="lg">
        <motion.div 
          style={{ 
            maxWidth: 800, 
            marginLeft: 'auto', 
            marginRight: 'auto', 
            textAlign: 'center',
            position: 'relative'
          }}
          variants={staggerContainer}
        >
          <MotionTitle
            order={1}
            style={{
              fontSize: '3.5rem',
              lineHeight: 1.2,
              fontWeight: 800,
              marginBottom: 32,
              background: 'linear-gradient(45deg, #5ADBFF 30%, #94FBFF 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
            variants={fadeInUp}
          >
            <TypeAnimation
              sequence={[
                ...personalInfo.heroTitles.flatMap(title => [title, 1000])
              ]}
              wrapper="span"
              speed={50}
              style={{ display: 'inline-block' }}
              repeat={Infinity}
            />
            <MotionText
              component="span"
              style={{
                display: 'block',
                background: 'linear-gradient(45deg, #3b82f6 30%, #60a5fa 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginTop: 8,
                fontSize: '1.75rem',
                fontWeight: 600,
              }}
              variants={fadeInUp}
            >
              <TypeAnimation
                sequence={[
                  ...personalInfo.heroSubtitles.flatMap(subtitle => [subtitle, 1000])
                ]}
                wrapper="span"
                speed={50}
                style={{ display: 'inline-block' }}
                repeat={Infinity}
              />
            </MotionText>
          </MotionTitle>

          <MotionText
            size="xl"
            style={{
              color: '#a1a1aa',
              marginBottom: 48,
              fontSize: '1.25rem',
              maxWidth: 600,
              marginLeft: 'auto',
              marginRight: 'auto',
              lineHeight: 1.8,
            }}
            variants={fadeInUp}
          >
            {personalInfo.bio}
          </MotionText>

          <MotionGroup justify="center" gap="md" variants={fadeInUp}>
            <motion.div 
              variants={glowingButtonVariants}
              initial="initial"
              animate="animate"
              whileHover="hover"
              whileTap="tap"
            >
              <Button
                component="a"
                href="#contact"
                size="xl"
                style={{
                  ...glowingButton,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                leftSection={<IconMail size={20} />}
              >
                Contact Me
              </Button>
            </motion.div>
            <motion.div 
              variants={outlineButtonVariants}
              initial="initial"
              animate="animate"
              whileHover="hover"
              whileTap="tap"
            >
              <Button
                component="a"
                href="#projects"
                size="xl"
                style={{
                  ...outlineButton,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                My Projects
              </Button>
            </motion.div>
          </MotionGroup>

          <MotionGroup justify="center" mt={48} variants={fadeInUp}>
            {personalInfo.githubUrl && (
              <motion.div 
                variants={socialButtonVariants}
                initial="initial"
                animate="animate"
                whileHover="hover"
                whileTap="tap"
              >
                <Button
                  component="a"
                  href={personalInfo.githubUrl}
                  target="_blank"
                  variant="subtle"
                  style={{
                    ...socialButton,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  leftSection={<IconBrandGithub size={24} />}
                >
                  GitHub
                </Button>
              </motion.div>
            )}
            {personalInfo.linkedinUrl && (
              <motion.div 
                variants={socialButtonVariants}
                initial="initial"
                animate="animate"
                whileHover="hover"
                whileTap="tap"
              >
                <Button
                  component="a"
                  href={personalInfo.linkedinUrl}
                  target="_blank"
                  variant="subtle"
                  style={{
                    ...socialButton,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  leftSection={<IconBrandLinkedin size={24} />}
                >
                  LinkedIn
                </Button>
              </motion.div>
            )}
          </MotionGroup>
        </motion.div>
      </Container>
    </MotionBox>
  );
} 