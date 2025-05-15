import { Container, Grid, Paper, Text, Title, Box } from '@mantine/core';
import { IconTemplate, IconDownload, IconAi, IconPalette } from '@tabler/icons-react';

const features = [
  {
    icon: IconTemplate,
    title: 'Professional Templates',
    description: 'Choose from a variety of modern, ATS-friendly templates designed to impress.',
  },
  {
    icon: IconAi,
    title: 'AI-Powered Content',
    description: 'Get smart suggestions for your skills and achievements using advanced AI.',
  },
  {
    icon: IconPalette,
    title: 'Easy Customization',
    description: 'Customize colors, fonts, and layouts to match your personal brand.',
  },
  {
    icon: IconDownload,
    title: 'Instant Download',
    description: 'Download your CV in multiple formats including PDF, Word, and plain text.',
  },
];

export function Features() {
  return (
    <Box style={{ padding: '80px 0', backgroundColor: '#fff' }}>
      <Container size="lg">
        <Title order={2} style={{ textAlign: 'center', marginBottom: 48, fontSize: 36 }}>
          Why Choose Our CV Builder?
        </Title>

        <Grid>
          {features.map((feature, index) => (
            <Grid.Col key={index} span={{ base: 12, sm: 6, md: 3 }}>
              <Paper
                p="xl"
                style={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  backgroundColor: 'transparent',
                  border: 'none',
                }}
              >
                <feature.icon size={48} style={{ color: '#3b82f6', marginBottom: 16 }} />
                <Text size="xl" fw={600} mb="sm">
                  {feature.title}
                </Text>
                <Text size="md" c="dimmed">
                  {feature.description}
                </Text>
              </Paper>
            </Grid.Col>
          ))}
        </Grid>
      </Container>
    </Box>
  );
} 