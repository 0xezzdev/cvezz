import { Container, Group, Text, Box, Stack } from '@mantine/core';
import { IconBrandGithub, IconBrandTwitter, IconBrandLinkedin } from '@tabler/icons-react';

export function Footer() {
  return (
    <Box
      style={{
        backgroundColor: '#1a1b1e',
        color: 'white',
        padding: '48px 0',
        marginTop: 'auto',
      }}
    >
      <Container size="lg">
        <Group justify="space-between" align="flex-start">
          <Stack gap="md">
            <Text size="xl" fw={700}>
              EZZ<span style={{ color: '#3b82f6' }}>CV</span>
            </Text>
            <Text size="sm" c="dimmed" maw={300}>
              Create professional CVs with ease using our AI-powered platform.
              Stand out from the crowd and land your dream job.
            </Text>
          </Stack>

          <Group>
            <Stack gap="xs">
              <Text fw={700}>Product</Text>
              <Text component="a" href="#" c="dimmed" style={{ textDecoration: 'none' }}>
                Templates
              </Text>
              <Text component="a" href="#" c="dimmed" style={{ textDecoration: 'none' }}>
                Features
              </Text>
              <Text component="a" href="#" c="dimmed" style={{ textDecoration: 'none' }}>
                Pricing
              </Text>
            </Stack>

            <Stack gap="xs" ml={48}>
              <Text fw={700}>Company</Text>
              <Text component="a" href="#" c="dimmed" style={{ textDecoration: 'none' }}>
                About
              </Text>
              <Text component="a" href="#" c="dimmed" style={{ textDecoration: 'none' }}>
                Contact
              </Text>
              <Text component="a" href="#" c="dimmed" style={{ textDecoration: 'none' }}>
                Privacy
              </Text>
            </Stack>
          </Group>

          <Stack gap="md">
            <Text fw={700}>Follow Us</Text>
            <Group>
              <IconBrandGithub style={{ cursor: 'pointer' }} />
              <IconBrandTwitter style={{ cursor: 'pointer' }} />
              <IconBrandLinkedin style={{ cursor: 'pointer' }} />
            </Group>
          </Stack>
        </Group>

        <Text c="dimmed" size="sm" ta="center" mt={48}>
          © 2024 EZZCV. All rights reserved.
        </Text>
      </Container>
    </Box>
  );
} 