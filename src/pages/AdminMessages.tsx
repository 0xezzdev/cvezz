import { Container, Title, Card, Text, Group, Stack, Badge, Button } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useState, useEffect } from 'react';
import { getContacts } from '../services/api';
import { IconMail } from '@tabler/icons-react';

interface Contact {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'pending' | 'responded';
  createdAt: string;
}

const ADMIN_EMAIL = 'ezz.web.dev@gmail.com';

export function AdminMessages() {
  const [messages, setMessages] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMessages = async () => {
    try {
      setError(null);
      setLoading(true);
      const data = await getContacts();
      console.log('Received messages:', data);
      
      if (!Array.isArray(data)) {
        throw new Error('Invalid response format');
      }
      
      // Transform dates to strings if they aren't already
      const formattedMessages = data.map(message => ({
        ...message,
        createdAt: typeof message.createdAt === 'string' 
          ? message.createdAt 
          : new Date(message.createdAt).toLocaleString('ar-EG')
      }));
      
      setMessages(formattedMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
      setError('حدث خطأ أثناء تحميل الرسائل');
      notifications.show({
        title: 'خطأ',
        message: 'حدث خطأ أثناء تحميل الرسائل',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleReply = (message: Contact) => {
    // Create Gmail compose URL
    const gmailUrl = new URL('https://mail.google.com/mail/');
    gmailUrl.searchParams.append('view', 'cm');
    gmailUrl.searchParams.append('to', message.email);
    gmailUrl.searchParams.append('su', `Re: ${message.subject}`);
    
    // Create email body with original message
    const emailBody = `\n\n-------------------\nالرسالة الأصلية:\n${message.message}`;
    gmailUrl.searchParams.append('body', emailBody);

    // Open Gmail in new tab
    window.open(gmailUrl.toString(), '_blank');
  };

  if (loading) {
    return (
      <Container size="lg">
        <Title order={2} mb="xl">
          إدارة الرسائل
        </Title>
        <Text>جاري التحميل...</Text>
      </Container>
    );
  }

  if (error) {
    return (
      <Container size="lg">
        <Title order={2} mb="xl">
          إدارة الرسائل
        </Title>
        <Text color="red">{error}</Text>
        <Button onClick={fetchMessages} mt="md">
          إعادة المحاولة
        </Button>
      </Container>
    );
  }

  return (
    <Container size="lg">
      <Title order={2} mb="xl">
        إدارة الرسائل
      </Title>

      {messages.length === 0 ? (
        <Text c="dimmed" ta="center">
          لا توجد رسائل حالياً
        </Text>
      ) : (
        <Stack>
          {messages.map((message) => (
            <Card key={message._id} withBorder>
              <Group justify="space-between" mb="xs">
                <Text fw={700} size="lg">
                  {message.subject}
                </Text>
                <Badge color={message.status === 'responded' ? 'green' : 'yellow'}>
                  {message.status === 'responded' ? 'تم الرد' : 'في الانتظار'}
                </Badge>
              </Group>
              <Text size="sm" c="dimmed" mb="md">
                من: {message.name} ({message.email})
              </Text>
              <Text size="sm" mb="md">
                {message.message}
              </Text>
              <Text size="sm" c="dimmed" mb="lg">
                تاريخ الإرسال: {message.createdAt}
              </Text>
              <Button
                variant="light"
                color="blue"
                leftSection={<IconMail size={16} />}
                onClick={() => handleReply(message)}
              >
                الرد عبر Gmail
              </Button>
            </Card>
          ))}
        </Stack>
      )}
    </Container>
  );
} 