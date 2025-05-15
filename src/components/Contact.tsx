import { Container, Title, TextInput, Textarea, Button, Box, Group, LoadingOverlay } from '@mantine/core';
import { IconSend } from '@tabler/icons-react';
import { useState } from 'react';
import { submitContact } from '../services/api';
import { notifications } from '@mantine/notifications';
import { motion, type MotionProps } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';

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

const formVariants = {
  initial: { 
    scale: 0.95,
    opacity: 0
  },
  animate: { 
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: [0.43, 0.13, 0.23, 0.96]
    }
  }
};

export function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await submitContact(formData);
      notifications.show({
        title: 'Message Sent',
        message: 'Thank you! I will get back to you as soon as possible.',
        color: 'teal',
      });
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'There was an error sending your message. Please try again.',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      component={motion.div}
      id="contact" 
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
          variants={fadeInUp}
          initial="initial"
          animate="animate"
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
                'Get in Touch',
                1000,
                'Contact Me',
                1000,
              ]}
              wrapper="span"
              speed={50}
              style={{ display: 'inline-block' }}
              repeat={Infinity}
            />
          </Title>
        </motion.div>

        <form onSubmit={handleSubmit}>
          <Box
            component={motion.div}
            style={{
              maxWidth: 600,
              margin: '0 auto',
              padding: 32,
              background: 'rgba(255, 255, 255, 0.03)',
              backdropFilter: 'blur(10px)',
              borderRadius: 12,
              border: '1px solid rgba(255,255,255,0.1)',
              position: 'relative',
            }}
            variants={formVariants}
          >
            <LoadingOverlay visible={loading} overlayProps={{ blur: 2 }} />
            
            <Group grow mb="md">
              <TextInput
                label="Name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                styles={{
                  input: {
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#fff',
                    '&::placeholder': { color: 'rgba(255,255,255,0.5)' }
                  },
                  label: { color: '#94FBFF' }
                }}
              />
              <TextInput
                label="Email"
                placeholder="Enter your email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                styles={{
                  input: {
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#fff',
                    '&::placeholder': { color: 'rgba(255,255,255,0.5)' }
                  },
                  label: { color: '#94FBFF' }
                }}
              />
            </Group>

            <TextInput
              label="Subject"
              placeholder="Message subject"
              mb="md"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              required
              styles={{
                input: {
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#fff',
                  '&::placeholder': { color: 'rgba(255,255,255,0.5)' }
                },
                label: { color: '#94FBFF' }
              }}
            />

            <Textarea
              label="Message"
              placeholder="Write your message here..."
              minRows={5}
              mb="xl"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              required
              styles={{
                input: {
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#fff',
                  '&::placeholder': { color: 'rgba(255,255,255,0.5)' }
                },
                label: { color: '#94FBFF' }
              }}
            />

            <Group justify="center">
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  type="submit"
                  size="lg"
                  style={{
                    background: 'linear-gradient(45deg, #3b82f6 30%, #60a5fa 90%)',
                    border: 'none',
                    boxShadow: '0 0 20px rgba(59,130,246,0.5)',
                    color: 'white',
                    padding: '12px 32px',
                    fontSize: '1.1rem',
                  }}
                  leftSection={<IconSend size={20} />}
                  loading={loading}
                >
                  Send Message
                </Button>
              </motion.div>
            </Group>
          </Box>
        </form>
      </Container>
    </Box>
  );
} 