import { Container, Title, TextInput, Textarea, Button, Paper, LoadingOverlay, Box, Group, ActionIcon } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useState, useEffect } from 'react';
import { getPersonalInfo, updatePersonalInfo, type PersonalInfo } from '../services/api';
import { IconTrash, IconPlus } from '@tabler/icons-react';

export function AdminPersonalInfo() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<PersonalInfo>({
    name: '',
    title: '',
    bio: '',
    email: '',
    githubUrl: '',
    linkedinUrl: '',
    heroTitles: [''],
    heroSubtitles: ['']
  });

  useEffect(() => {
    const fetchPersonalInfo = async () => {
      try {
        const data = await getPersonalInfo();
        setFormData(data);
      } catch (error) {
        notifications.show({
          title: 'خطأ',
          message: 'حدث خطأ أثناء تحميل المعلومات الشخصية',
          color: 'red',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPersonalInfo();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await updatePersonalInfo(formData);
      notifications.show({
        title: 'تم الحفظ',
        message: 'تم تحديث المعلومات الشخصية بنجاح',
        color: 'green',
      });
    } catch (error) {
      notifications.show({
        title: 'خطأ',
        message: 'حدث خطأ أثناء حفظ المعلومات الشخصية',
        color: 'red',
      });
    } finally {
      setSaving(false);
    }
  };

  const addHeroTitle = () => {
    setFormData({
      ...formData,
      heroTitles: [...formData.heroTitles, '']
    });
  };

  const removeHeroTitle = (index: number) => {
    setFormData({
      ...formData,
      heroTitles: formData.heroTitles.filter((_, i) => i !== index)
    });
  };

  const updateHeroTitle = (index: number, value: string) => {
    const newTitles = [...formData.heroTitles];
    newTitles[index] = value;
    setFormData({
      ...formData,
      heroTitles: newTitles
    });
  };

  const addHeroSubtitle = () => {
    setFormData({
      ...formData,
      heroSubtitles: [...formData.heroSubtitles, '']
    });
  };

  const removeHeroSubtitle = (index: number) => {
    setFormData({
      ...formData,
      heroSubtitles: formData.heroSubtitles.filter((_, i) => i !== index)
    });
  };

  const updateHeroSubtitle = (index: number, value: string) => {
    const newSubtitles = [...formData.heroSubtitles];
    newSubtitles[index] = value;
    setFormData({
      ...formData,
      heroSubtitles: newSubtitles
    });
  };

  if (loading) {
    return (
      <Container size="lg">
        <Title order={2} mb="xl">
          المعلومات الشخصية
        </Title>
        <div>جاري التحميل...</div>
      </Container>
    );
  }

  return (
    <Container size="lg">
      <Title order={2} mb="xl">
        المعلومات الشخصية
      </Title>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md" pos="relative">
        <LoadingOverlay visible={saving} overlayProps={{ blur: 2 }} />
        
        <form onSubmit={handleSubmit}>
          <TextInput
            label="الاسم"
            placeholder="أدخل اسمك"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            mb="md"
          />

          <TextInput
            label="المسمى الوظيفي"
            placeholder="مثال: مطور ويب Full Stack"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            mb="md"
          />

          <Textarea
            label="نبذة عني"
            placeholder="اكتب نبذة مختصرة عن نفسك"
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            required
            mb="md"
            minRows={3}
          />

          <Box mb="xl">
            <Title order={4} mb="md">نصوص العنوان المتغيرة</Title>
            {formData.heroTitles.map((title, index) => (
              <Group key={index} mb="xs">
                <TextInput
                  placeholder="أدخل نص العنوان"
                  value={title}
                  onChange={(e) => updateHeroTitle(index, e.target.value)}
                  required
                  style={{ flex: 1 }}
                />
                <ActionIcon
                  color="red"
                  onClick={() => removeHeroTitle(index)}
                  disabled={formData.heroTitles.length <= 1}
                >
                  <IconTrash size={16} />
                </ActionIcon>
              </Group>
            ))}
            <Button
              variant="light"
              leftSection={<IconPlus size={16} />}
              onClick={addHeroTitle}
              mt="xs"
            >
              إضافة عنوان جديد
            </Button>
          </Box>

          <Box mb="xl">
            <Title order={4} mb="md">نصوص العنوان الفرعي المتغيرة</Title>
            {formData.heroSubtitles.map((subtitle, index) => (
              <Group key={index} mb="xs">
                <TextInput
                  placeholder="أدخل نص العنوان الفرعي"
                  value={subtitle}
                  onChange={(e) => updateHeroSubtitle(index, e.target.value)}
                  required
                  style={{ flex: 1 }}
                />
                <ActionIcon
                  color="red"
                  onClick={() => removeHeroSubtitle(index)}
                  disabled={formData.heroSubtitles.length <= 1}
                >
                  <IconTrash size={16} />
                </ActionIcon>
              </Group>
            ))}
            <Button
              variant="light"
              leftSection={<IconPlus size={16} />}
              onClick={addHeroSubtitle}
              mt="xs"
            >
              إضافة عنوان فرعي جديد
            </Button>
          </Box>

          <TextInput
            label="البريد الإلكتروني"
            placeholder="أدخل بريدك الإلكتروني"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            mb="md"
          />

          <TextInput
            label="رابط GitHub"
            placeholder="أدخل رابط حسابك على GitHub"
            value={formData.githubUrl}
            onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
            mb="md"
          />

          <TextInput
            label="رابط LinkedIn"
            placeholder="أدخل رابط حسابك على LinkedIn"
            value={formData.linkedinUrl}
            onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
            mb="xl"
          />

          <Button type="submit" loading={saving}>
            حفظ التغييرات
          </Button>
        </form>
      </Paper>
    </Container>
  );
} 