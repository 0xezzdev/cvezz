import { Container, Title, Grid, Card, Text, Group, Badge, Button, Box, LoadingOverlay } from '@mantine/core';
import { IconBrandGithub, IconExternalLink } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { getProjects } from '../services/api';
import type { Project as ApiProject } from '../services/api';
import { motion } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';

type Project = ApiProject;

const cardVariants = {
  initial: { 
    y: 50,
    opacity: 0,
    scale: 0.9
  },
  animate: { 
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.43, 0.13, 0.23, 0.96]
    }
  },
  hover: {
    y: -10,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  }
};

const badgeVariants = {
  initial: { scale: 0, opacity: 0 },
  animate: { 
    scale: 1, 
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  }
};

const buttonVariants = {
  hover: { 
    scale: 1.05,
    transition: {
      duration: 0.2,
      ease: "easeOut"
    }
  },
  tap: { scale: 0.95 }
};

export function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getProjects();
        setProjects(data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return (
      <Box pos="relative" h={400} style={{ background: '#1a1b1e' }}>
        <LoadingOverlay visible={true} overlayProps={{ blur: 2 }} />
      </Box>
    );
  }

  return (
    <Box
      component={motion.div}
      id="projects" 
      style={{ 
        padding: '80px 0',
        background: 'linear-gradient(135deg, #1a1b1e 0%, #2C2E33 100%)',
        overflow: 'hidden'
      }}
      initial="initial"
      animate="animate"
    >
      <Container size="lg">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Title
            order={2}
            style={{
              fontSize: '2.8rem',
              marginBottom: 48,
              textAlign: 'center',
              background: 'linear-gradient(45deg, #5ADBFF 30%, #94FBFF 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            <TypeAnimation
              sequence={[
                'My Projects',
                1000,
                'Featured Work',
                1000,
              ]}
              wrapper="span"
              speed={50}
              style={{ display: 'inline-block' }}
              repeat={Infinity}
            />
          </Title>
        </motion.div>

        <Grid>
          {projects.map((project, index) => (
            <Grid.Col key={project._id} span={{ base: 12, md: 6, lg: 4 }}>
              <motion.div
                variants={cardVariants}
                initial="initial"
                animate="animate"
                whileHover="hover"
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  shadow="lg"
                  padding="xl"
                  radius="md"
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                  }}
                >
                  {project.image && (
                    <Card.Section>
                      <motion.img
                        src={project.image}
                        alt={project.title}
                        style={{ 
                          width: '100%', 
                          height: 200, 
                          objectFit: 'cover',
                          borderBottom: '1px solid rgba(255,255,255,0.1)'
                        }}
                        initial={{ scale: 1.2, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                      />
                    </Card.Section>
                  )}

                  <Text 
                    fw={700} 
                    size="xl" 
                    mt="md"
                    style={{
                      color: '#94FBFF',
                      fontSize: '1.5rem'
                    }}
                  >
                    {project.title}
                  </Text>

                  <Text 
                    size="sm" 
                    mt="sm"
                    style={{
                      color: 'rgba(255,255,255,0.7)',
                      lineHeight: 1.6
                    }}
                  >
                    {project.description}
                  </Text>

                  {project.technologies && project.technologies.length > 0 && (
                    <Group mt="md" mb="md">
                      {project.technologies.map((tech, techIndex) => (
                        <motion.div
                          key={tech}
                          variants={badgeVariants}
                          initial="initial"
                          animate="animate"
                          transition={{ delay: index * 0.1 + techIndex * 0.1 }}
                        >
                          <Badge
                            style={{
                              background: 'rgba(148,251,255,0.1)',
                              color: '#94FBFF',
                              border: '1px solid rgba(148,251,255,0.3)'
                            }}
                          >
                            {tech}
                          </Badge>
                        </motion.div>
                      ))}
                    </Group>
                  )}

                  <Group mt="md">
                    {project.githubLink && (
                      <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                        <Button
                          component="a"
                          href={project.githubLink}
                          target="_blank"
                          variant="light"
                          style={{
                            background: 'rgba(148,251,255,0.05)',
                            color: '#94FBFF',
                            backdropFilter: 'blur(10px)',
                          }}
                          leftSection={<IconBrandGithub size={20} />}
                        >
                          GitHub
                        </Button>
                      </motion.div>
                    )}
                    {project.liveLink && (
                      <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                        <Button
                          component="a"
                          href={project.liveLink}
                          target="_blank"
                          variant="light"
                          style={{
                            background: 'rgba(148,251,255,0.05)',
                            color: '#94FBFF',
                            backdropFilter: 'blur(10px)',
                          }}
                          leftSection={<IconExternalLink size={20} />}
                        >
                          View Project
                        </Button>
                      </motion.div>
                    )}
                  </Group>
                </Card>
              </motion.div>
            </Grid.Col>
          ))}
        </Grid>
      </Container>
    </Box>
  );
} 