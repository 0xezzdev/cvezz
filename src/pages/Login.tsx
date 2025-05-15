import { Container, TextInput, PasswordInput, Button, Paper, Title, LoadingOverlay } from '@mantine/core';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/api';
import { notifications } from '@mantine/notifications';

export function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await login(formData.username, formData.password);
      localStorage.setItem('token', data.token);
      notifications.show({
        title: 'تم تسجيل الدخول بنجاح',
        message: 'مرحباً بك في لوحة التحكم',
        color: 'green',
      });
      navigate('/admin');
    } catch (error) {
      notifications.show({
        title: 'خطأ',
        message: 'اسم المستخدم أو كلمة المرور غير صحيحة',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size={420} my={40}>
      <Title ta="center" style={{ marginBottom: 24 }}>
        تسجيل الدخول للوحة التحكم
      </Title>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md" pos="relative">
        <LoadingOverlay visible={loading} overlayProps={{ blur: 2 }} />
        
        <form onSubmit={handleSubmit}>
          <TextInput
            label="اسم المستخدم"
            placeholder="أدخل اسم المستخدم"
            required
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          />
          <PasswordInput
            label="كلمة المرور"
            placeholder="أدخل كلمة المرور"
            required
            mt="md"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
          <Button fullWidth mt="xl" type="submit" loading={loading}>
            تسجيل الدخول
          </Button>
        </form>
      </Paper>
    </Container>
  );
} 