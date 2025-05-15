import { Container, Title, Grid, Paper, Text, Progress, Box, Group, LoadingOverlay, Alert, Button } from '@mantine/core';
import { IconAlertCircle, IconRefresh } from '@tabler/icons-react';
import { useEffect, useState, useCallback } from 'react';
import { getSkills, type Skill, type SkillCategory } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';

const MotionPaper = motion(Paper as any);
const MotionBox = motion(Box as any);
const MotionText = motion(Text as any);
const MotionTitle = motion(Title as any);

const categoryNames: Record<SkillCategory, string> = {
  'برمجة': 'مهارات البرمجة',
  'تصميم': 'مهارات التصميم',
  'قواعد بيانات': 'قواعد البيانات',
  'تطوير واجهات': 'تطوير الواجهات',
  'تطوير تطبيقات': 'تطوير التطبيقات',
  'أخرى': 'مهارات أخرى'
};

const getProgressColor = (level: number) => {
  if (level < 50) return '#FF3B30';
  if (level < 70) return '#FFCC00';
  return '#34C759';
};

const titleAnimation = {
  initial: { 
    y: 20, 
    opacity: 0,
    clipPath: 'inset(100% 0% 0% 0%)'
  },
  animate: { 
    y: 0, 
    opacity: 1,
    clipPath: 'inset(0% 0% 0% 0%)',
    transition: {
      duration: 0.7,
      ease: [0.43, 0.13, 0.23, 0.96]
    }
  }
};

const descriptionAnimation = {
  initial: { 
    y: 10, 
    opacity: 0,
    clipPath: 'inset(100% 0% 0% 0%)'
  },
  animate: { 
    y: 0, 
    opacity: 1,
    clipPath: 'inset(0% 0% 0% 0%)',
    transition: {
      duration: 0.5,
      ease: [0.43, 0.13, 0.23, 0.96],
      delay: 0.2
    }
  }
};

const containerReveal = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
};

const cardAnimation = {
  initial: {
    y: 50,
    opacity: 0,
    scale: 0.95
  },
  animate: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.43, 0.13, 0.23, 0.96]
    }
  }
};

export function Skills() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const fetchSkills = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getSkills();
      if (!data || data.length === 0) {
        setError('لم يتم العثور على أي مهارات.');
        return;
      }
      setSkills(data);
    } catch (error: any) {
      console.error('Error fetching skills:', error);
      setError('فشل في تحميل المهارات');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSkills();
    const timer = setTimeout(() => setIsVisible(true), 500);
    return () => clearTimeout(timer);
  }, [fetchSkills]);

  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<SkillCategory, Skill[]>);

  if (loading) {
    return (
      <Box pos="relative" h={200}>
        <LoadingOverlay visible={true} overlayProps={{ blur: 2 }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Container size="lg">
        <Alert icon={<IconAlertCircle size={16} />} title="خطأ" color="red" variant="filled">
          {error}
          <Button variant="white" color="red" onClick={fetchSkills} leftSection={<IconRefresh size={16} />} mt="sm">
            إعادة المحاولة
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Box 
      id="skills" 
      py={80} 
      style={{
        background: 'linear-gradient(135deg, #1a1b1e 0%, #2C2E33 100%)',
        boxShadow: 'inset 0 0 50px rgba(0,0,0,0.3)'
      }}
    >
      <Container size="lg">
        <MotionBox
          initial="initial"
          animate="animate"
          variants={containerReveal}
          mb={60}
          ta="center"
        >
          <Box mb={20}>
            <TypeAnimation
              sequence={[
                'مهاراتي المتخصصة',
                1000,
                'My Professional Skills',
                1000,
              ]}
              wrapper="h2"
              speed={50}
              style={{
                fontSize: '2.8rem',
                display: 'inline-block',
                background: 'linear-gradient(45deg, #5ADBFF 30%, #94FBFF 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: '0.5em',
                fontWeight: 700
              }}
              repeat={Infinity}
            />
          </Box>
        </MotionBox>

        <motion.div
          variants={containerReveal}
          initial="initial"
          animate="animate"
        >
          <Grid>
            {Object.entries(groupedSkills).map(([category, categorySkills], categoryIndex) => (
              <Grid.Col key={category} span={{ base: 12, md: 6 }}>
                <MotionPaper
                  shadow="sm"
                  p="xl"
                  radius="lg"
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                  }}
                  variants={cardAnimation}
                  whileHover={{
                    y: -5,
                    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                    background: 'rgba(255, 255, 255, 0.05)',
                    transition: { duration: 0.3 }
                  }}
                >
                  <MotionTitle 
                    order={3} 
                    mb={30}
                    style={{
                      fontSize: '1.8rem',
                      color: '#94FBFF',
                      borderBottom: '2px solid rgba(255,255,255,0.1)',
                      paddingBottom: '15px'
                    }}
                    variants={titleAnimation}
                  >
                    {categoryNames[category as SkillCategory]}
                  </MotionTitle>

                  <motion.div variants={containerReveal}>
                    {categorySkills.map((skill, skillIndex) => (
                      <MotionBox
                        key={skill._id}
                        mb="xl"
                        variants={cardAnimation}
                      >
                        <Group justify="space-between" mb={10}>
                          <Box style={{ flex: 1 }}>
                            <MotionText 
                              fw={600} 
                              size="lg" 
                              mb={8}
                              style={{ color: '#ffffff' }}
                              variants={titleAnimation}
                            >
                              {skill.title}
                            </MotionText>
                            {skill.description && (
                              <MotionText 
                                size="sm"
                                style={{ 
                                  color: 'rgba(255,255,255,0.7)',
                                  lineHeight: 1.6
                                }}
                                variants={descriptionAnimation}
                              >
                                {skill.description}
                              </MotionText>
                            )}
                          </Box>
                          <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                          >
                            <Box
                              style={{
                                background: `rgba(${skill.level < 50 ? '255,59,48' : skill.level < 70 ? '255,204,0' : '52,199,89'},0.15)`,
                                padding: '6px 12px',
                                borderRadius: '20px',
                                minWidth: '60px',
                                textAlign: 'center',
                                border: `1px solid ${getProgressColor(skill.level)}`,
                                boxShadow: `0 0 15px ${getProgressColor(skill.level)}40`
                              }}
                            >
                              <Text 
                                fw={700} 
                                size="sm" 
                                style={{ 
                                  color: getProgressColor(skill.level),
                                  textShadow: `0 0 10px ${getProgressColor(skill.level)}`
                                }}
                              >
                                {skill.level}%
                              </Text>
                            </Box>
                          </motion.div>
                        </Group>
                        <motion.div
                          initial={{ scaleX: 0, opacity: 0 }}
                          animate={{ scaleX: 1, opacity: 1 }}
                          transition={{ delay: 0.4, duration: 0.7 }}
                          style={{ transformOrigin: 'left' }}
                        >
                          <Progress
                            value={skill.level}
                            color={getProgressColor(skill.level)}
                            size="lg"
                            radius="xl"
                            animated
                            style={{
                              backgroundColor: 'rgba(255,255,255,0.05)',
                            }}
                            styles={{
                              root: {
                                transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)',
                                boxShadow: `0 0 20px ${getProgressColor(skill.level)}40`,
                              }
                            }}
                          />
                        </motion.div>
                      </MotionBox>
                    ))}
                  </motion.div>
                </MotionPaper>
              </Grid.Col>
            ))}
          </Grid>
        </motion.div>
      </Container>
    </Box>
  );
} 