import { Container, Title, Grid, Card, Text, Group, Badge, Button, Image, Box, LoadingOverlay, Alert } from '@mantine/core';
import { IconExternalLink, IconCalendar, IconAlertCircle } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { getCertificates, type Certificate } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import dayjs from 'dayjs';
import 'dayjs/locale/ar';

dayjs.locale('ar');

const MotionCard = motion(Card as any);
const MotionGrid = motion(Grid as any);

export function Certificates() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const data = await getCertificates();
        setCertificates(data);
        setError(null);
      } catch (error) {
        console.error('Error fetching certificates:', error);
        setError('حدث خطأ أثناء تحميل الشهادات. يرجى المحاولة مرة أخرى.');
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, []);

  const formatDate = (date: string) => {
    return dayjs(date).format('MMMM YYYY');
  };

  return (
    <Box id="certificates" style={{ padding: '80px 0', backgroundColor: '#fff' }}>
      <Container size="lg" pos="relative">
        <LoadingOverlay 
          visible={loading} 
          zIndex={1000} 
          overlayProps={{ radius: "sm", blur: 2 }}
          loaderProps={{ color: 'blue', size: 'xl' }}
        />

        <Title
          order={2}
          style={{
            fontSize: '2.5rem',
            marginBottom: 48,
            textAlign: 'center',
          }}
        >
          الشهادات والإنجازات
        </Title>

        {error ? (
          <Alert 
            icon={<IconAlertCircle size={16} />}
            title="خطأ"
            color="red"
            radius="md"
          >
            {error}
          </Alert>
        ) : (
          <AnimatePresence>
            <MotionGrid
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {certificates.map((certificate, index) => (
                <Grid.Col key={certificate._id} span={{ base: 12, md: 6, lg: 4 }}>
                  <MotionCard
                    shadow="sm"
                    padding="lg"
                    radius="md"
                    withBorder
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ 
                      opacity: 1, 
                      y: 0,
                      transition: { 
                        delay: index * 0.1,
                        duration: 0.5,
                        ease: "easeOut"
                      }
                    }}
                    whileHover={{ 
                      scale: 1.02,
                      transition: { duration: 0.2 }
                    }}
                  >
                    {certificate.image && (
                      <Card.Section>
                        <Image
                          src={certificate.image}
                          alt={certificate.title}
                          height={200}
                          fit="cover"
                          style={{ 
                            transition: 'transform 0.3s ease',
                            '&:hover': {
                              transform: 'scale(1.05)'
                            }
                          }}
                        />
                      </Card.Section>
                    )}

                    <Group justify="space-between" mt="md">
                      <Text fw={700} size="lg">
                        {certificate.title}
                      </Text>
                      <Badge color="blue" variant="light">
                        {certificate.issuer}
                      </Badge>
                    </Group>

                    <Group align="center" mt="xs">
                      <IconCalendar size={16} />
                      <Text size="sm" c="dimmed">
                        {formatDate(certificate.date)}
                      </Text>
                    </Group>

                    {certificate.description && (
                      <Text size="sm" mt="sm" c="dimmed" lineClamp={3}>
                        {certificate.description}
                      </Text>
                    )}

                    {certificate.url && (
                      <Button
                        component="a"
                        href={certificate.url}
                        target="_blank"
                        variant="light"
                        color="blue"
                        fullWidth
                        mt="md"
                        radius="md"
                        leftSection={<IconExternalLink size={16} />}
                      >
                        عرض الشهادة
                      </Button>
                    )}
                  </MotionCard>
                </Grid.Col>
              ))}
            </MotionGrid>
          </AnimatePresence>
        )}
      </Container>
    </Box>
  );
} 