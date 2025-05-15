import { Container, Title, Button, Card, Text, Group, Stack, Modal, TextInput, Textarea, FileInput, Image } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { IconPlus, IconEdit, IconTrash, IconUpload } from '@tabler/icons-react';
import { useState, useEffect } from 'react';
import { getCertificates, createCertificate, updateCertificate, deleteCertificate, type Certificate, type CertificateInput } from '../services/api';
import { DateInput } from '@mantine/dates';
import 'dayjs/locale/ar';

export function AdminCertificates() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [opened, { open, close }] = useDisclosure(false);
  const [formData, setFormData] = useState<CertificateInput>({
    title: '',
    issuer: '',
    date: '',
    description: '',
    url: '',
    image: null,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      const data = await getCertificates();
      setCertificates(data);
    } catch (error) {
      console.error('Error fetching certificates:', error);
      notifications.show({
        title: 'خطأ',
        message: 'حدث خطأ أثناء تحميل الشهادات',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (file: File | null) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setFormData({ ...formData, image: file });
    } else {
      setImagePreview(null);
      setFormData({ ...formData, image: null });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Form validation
    if (!formData.title.trim() || !formData.issuer.trim() || !formData.date) {
      notifications.show({
        title: 'خطأ',
        message: 'يرجى ملء جميع الحقول المطلوبة',
        color: 'red',
      });
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('issuer', formData.issuer);
      formDataToSend.append('date', formData.date);
      if (formData.description) formDataToSend.append('description', formData.description);
      if (formData.url) formDataToSend.append('url', formData.url);
      if (formData.image) formDataToSend.append('image', formData.image);

      if (selectedCertificate) {
        await updateCertificate(selectedCertificate._id, formDataToSend);
        notifications.show({
          title: 'تم',
          message: 'تم تحديث الشهادة بنجاح',
          color: 'green',
        });
      } else {
        await createCertificate(formDataToSend);
        notifications.show({
          title: 'تم',
          message: 'تم إضافة الشهادة بنجاح',
          color: 'green',
        });
      }
      close();
      fetchCertificates();
      resetForm();
    } catch (error) {
      console.error('Error saving certificate:', error);
      notifications.show({
        title: 'خطأ',
        message: 'حدث خطأ أثناء حفظ الشهادة',
        color: 'red',
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('هل أنت متأكد من حذف هذه الشهادة؟')) return;
    
    try {
      await deleteCertificate(id);
      notifications.show({
        title: 'تم',
        message: 'تم حذف الشهادة بنجاح',
        color: 'green',
      });
      fetchCertificates();
    } catch (error) {
      console.error('Error deleting certificate:', error);
      notifications.show({
        title: 'خطأ',
        message: 'حدث خطأ أثناء حذف الشهادة',
        color: 'red',
      });
    }
  };

  const handleEdit = (certificate: Certificate) => {
    setSelectedCertificate(certificate);
    setFormData({
      title: certificate.title,
      issuer: certificate.issuer,
      date: certificate.date,
      description: certificate.description || '',
      url: certificate.url || '',
      image: certificate.image || null,
    });
    if (certificate.image) {
      setImagePreview(certificate.image);
    }
    open();
  };

  const resetForm = () => {
    setSelectedCertificate(null);
    setFormData({
      title: '',
      issuer: '',
      date: '',
      description: '',
      url: '',
      image: null,
    });
    setImagePreview(null);
  };

  const handleAddNew = () => {
    resetForm();
    open();
  };

  if (loading) {
    return <div>جاري التحميل...</div>;
  }

  return (
    <Container size="lg" py="xl">
      <Group justify="space-between" mb="xl">
        <Title order={2}>إدارة الشهادات</Title>
        <Button
          leftSection={<IconPlus size={20} />}
          onClick={handleAddNew}
        >
          إضافة شهادة
        </Button>
      </Group>

      <Stack>
        {certificates.map((certificate) => (
          <Card key={certificate._id} shadow="sm" padding="lg" radius="md" withBorder>
            <Group justify="space-between" align="flex-start">
              <div>
                <Text fw={700} size="lg">
                  {certificate.title}
                </Text>
                <Text size="sm" c="dimmed" mt={4}>
                  {certificate.issuer} • {certificate.date}
                </Text>
                {certificate.description && (
                  <Text size="sm" mt="sm">
                    {certificate.description}
                  </Text>
                )}
              </div>
              <Group>
                <Button
                  variant="light"
                  color="blue"
                  size="sm"
                  leftSection={<IconEdit size={20} />}
                  onClick={() => handleEdit(certificate)}
                >
                  تعديل
                </Button>
                <Button
                  variant="light"
                  color="red"
                  size="sm"
                  leftSection={<IconTrash size={20} />}
                  onClick={() => handleDelete(certificate._id)}
                >
                  حذف
                </Button>
              </Group>
            </Group>
          </Card>
        ))}
      </Stack>

      <Modal
        opened={opened}
        onClose={() => {
          close();
          resetForm();
        }}
        title={selectedCertificate ? 'تعديل الشهادة' : 'إضافة شهادة جديدة'}
        size="lg"
      >
        <form onSubmit={handleSubmit}>
          <Stack>
            <TextInput
              label="عنوان الشهادة"
              placeholder="أدخل عنوان الشهادة"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
            <TextInput
              label="الجهة المانحة"
              placeholder="أدخل اسم الجهة المانحة"
              required
              value={formData.issuer}
              onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
            />
            <DateInput
              label="تاريخ الحصول"
              placeholder="اختر التاريخ"
              required
              locale="ar"
              value={formData.date ? new Date(formData.date) : null}
              onChange={(date) => setFormData({ ...formData, date: date ? date.toISOString() : '' })}
            />
            <Textarea
              label="الوصف"
              placeholder="أدخل وصفاً للشهادة"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            <TextInput
              label="رابط الشهادة"
              placeholder="أدخل رابط الشهادة (اختياري)"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
            />
            <FileInput
              label="صورة الشهادة"
              placeholder="اختر صورة الشهادة"
              accept="image/*"
              leftSection={<IconUpload size={16} />}
              onChange={handleImageChange}
            />
            {imagePreview && (
              <Image
                src={imagePreview}
                alt="معاينة الصورة"
                fit="contain"
                height={200}
              />
            )}
            <Group justify="flex-end" mt="md">
              <Button type="submit" loading={loading}>
                {selectedCertificate ? 'تحديث' : 'إضافة'}
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </Container>
  );
} 