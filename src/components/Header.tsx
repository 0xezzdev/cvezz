import { Container, Group, Button, Box, Text } from '@mantine/core';
import { IconUserCircle } from '@tabler/icons-react';

export function Header() {
  return (
    <Box
      style={{
        height: 60,
        backgroundColor: '#1a1b1e',
        borderBottom: '1px solid #2d2d2d',
      }}
    >
      <Container size="lg" h="100%">
        <Group justify="space-between" h="100%">
          <Text
            size="xl"
            fw={700}
            style={{
              color: 'white',
              textDecoration: 'none',
              cursor: 'pointer',
            }}
          >
            EZZ<span style={{ color: '#3b82f6' }}>CV</span>
          </Text>

          <Group>
            <Button variant="subtle" color="gray" style={{ color: 'white' }}>
              Templates
            </Button>
            <Button variant="subtle" color="gray" style={{ color: 'white' }}>
              Features
            </Button>
            <Button variant="subtle" color="gray" style={{ color: 'white' }}>
              Pricing
            </Button>
            <Button
              variant="outline"
              style={{
                color: 'white',
                borderColor: 'white',
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' },
              }}
              leftSection={<IconUserCircle size={20} />}
            >
              Sign In
            </Button>
          </Group>
        </Group>
      </Container>
    </Box>
  );
} 