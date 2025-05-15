import { Container, Title, Button, Card, Text, Group, Stack, Modal, TextInput, NumberInput, Select, Textarea } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { IconPlus, IconEdit, IconTrash } from '@tabler/icons-react';
import { useState, useEffect } from 'react';
import { getSkills, createSkill, updateSkill, deleteSkill, type Skill, type SkillInput, type SkillCategory } from '../services/api';

const SKILL_CATEGORIES = [
  { value: 'برمجة', label: 'برمجة' },
  { value: 'تصميم', label: 'تصميم' },
  { value: 'قواعد بيانات', label: 'قواعد بيانات' },
  { value: 'تطوير واجهات', label: 'تطوير واجهات' },
  { value: 'تطوير تطبيقات', label: 'تطوير تطبيقات' },
  { value: 'أخرى', label: 'أخرى' }
];

export function AdminSkills() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [opened, { open, close }] = useDisclosure(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [formData, setFormData] = useState<SkillInput>({
    title: '',
    description: '',
    image: '',
    level: 50,
    category: 'أخرى'
  });

  const fetchSkills = async () => {
    try {
      setLoading(true);
      const data = await getSkills();
      setSkills(data);
    } catch (error) {
      notifications.show({
        title: 'خطأ',
        message: 'فشل في تحميل المهارات',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingSkill) {
        await updateSkill(editingSkill._id, formData);
        notifications.show({
          title: 'تم',
          message: 'تم تحديث المهارة بنجاح',
          color: 'green',
        });
      } else {
        await createSkill(formData);
        notifications.show({
          title: 'تم',
          message: 'تم إضافة المهارة بنجاح',
          color: 'green',
        });
      }
      close();
      fetchSkills();
      setFormData({
        title: '',
        description: '',
        image: '',
        level: 50,
        category: 'أخرى'
      });
      setEditingSkill(null);
    } catch (error) {
      notifications.show({
        title: 'خطأ',
        message: 'فشل في حفظ المهارة',
        color: 'red',
      });
    }
  };

  const handleEdit = (skill: Skill) => {
    setEditingSkill(skill);
    setFormData({
      title: skill.title,
      description: skill.description,
      image: skill.image,
      level: skill.level,
      category: skill.category
    });
    open();
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('هل أنت متأكد من حذف هذه المهارة؟')) return;
    
    try {
      await deleteSkill(id);
      notifications.show({
        title: 'تم',
        message: 'تم حذف المهارة بنجاح',
        color: 'green',
      });
      fetchSkills();
    } catch (error) {
      notifications.show({
        title: 'خطأ',
        message: 'فشل في حذف المهارة',
        color: 'red',
      });
    }
  };

  return (
    <Container size="lg">
      <Group justify="space-between" mb="xl">
        <Title order={2}>إدارة المهارات</Title>
        <Button
          onClick={() => {
            setEditingSkill(null);
            setFormData({
              title: '',
              description: '',
              image: '',
              level: 50,
              category: 'أخرى'
            });
            open();
          }}
          leftSection={<IconPlus size={20} />}
        >
          إضافة مهارة
        </Button>
      </Group>

      <Stack>
        {skills.map((skill) => (
          <Card key={skill._id} shadow="sm" padding="lg" radius="md" withBorder>
            <Group justify="space-between">
              <div>
                <Text fw={500} size="lg">{skill.title}</Text>
                <Text c="dimmed" size="sm">{skill.description}</Text>
                <Text>المستوى: {skill.level}%</Text>
                <Text>التصنيف: {skill.category}</Text>
              </div>
              <Group>
                <Button variant="light" onClick={() => handleEdit(skill)} leftSection={<IconEdit size={20} />}>
                  تعديل
                </Button>
                <Button variant="light" color="red" onClick={() => handleDelete(skill._id)} leftSection={<IconTrash size={20} />}>
                  حذف
                </Button>
              </Group>
            </Group>
          </Card>
        ))}
      </Stack>

      <Modal
        opened={opened}
        onClose={close}
        title={editingSkill ? 'تعديل المهارة' : 'إضافة مهارة جديدة'}
        size="lg"
      >
        <form onSubmit={handleSubmit}>
          <TextInput
            label="اسم المهارة"
            placeholder="أدخل اسم المهارة"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            mb="md"
          />

          <Textarea
            label="وصف المهارة"
            placeholder="اكتب وصفاً للمهارة"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
            mb="md"
          />

          <TextInput
            label="رابط الصورة"
            placeholder="أدخل رابط صورة المهارة"
            value={formData.image}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            mb="md"
          />

          <NumberInput
            label="المستوى"
            placeholder="أدخل مستوى المهارة"
            value={formData.level}
            onChange={(value) => setFormData({ ...formData, level: typeof value === 'number' ? value : 0 })}
            min={0}
            max={100}
            required
            mb="md"
          />

          <Select
            label="التصنيف"
            placeholder="اختر تصنيف المهارة"
            data={SKILL_CATEGORIES}
            value={formData.category}
            onChange={(value) => setFormData({ ...formData, category: (value || 'أخرى') as SkillCategory })}
            required
            mb="xl"
          />

          <Group justify="flex-end">
            <Button type="submit">
              {editingSkill ? 'تحديث' : 'إضافة'}
            </Button>
          </Group>
        </form>
      </Modal>
    </Container>
  );
} 