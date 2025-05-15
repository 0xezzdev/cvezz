import { Container, Title, Button, Card, Text, Group, Stack, Modal, TextInput, Textarea, Select, FileInput } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { IconPlus, IconEdit, IconTrash, IconUpload } from '@tabler/icons-react';
import { useState, useEffect } from 'react';
import { getProjects, createProject, updateProject, deleteProject } from '../services/api';
import type { ProjectCategory, Project as ApiProject } from '../services/api';

interface Project extends ApiProject {}

const PROJECT_CATEGORIES = [
  { value: 'web', label: 'تطبيق ويب' },
  { value: 'mobile', label: 'تطبيق موبايل' },
  { value: 'desktop', label: 'تطبيق سطح المكتب' },
  { value: 'game', label: 'تطوير ألعاب' },
  { value: 'ai', label: 'ذكاء اصطناعي' },
  { value: 'backend', label: 'تطوير خلفي' },
  { value: 'frontend', label: 'تطوير واجهات' },
  { value: 'fullstack', label: 'تطوير متكامل' },
  { value: 'other', label: 'أخرى' }
];

export function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [opened, { open, close }] = useDisclosure(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    category: '' as ProjectCategory,
    githubLink: '',
    liveLink: '',
    technologies: [] as string[]
  });

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const data = await getProjects();
      setProjects(data);
    } catch (error) {
      notifications.show({
        title: 'خطأ',
        message: 'حدث خطأ أثناء تحميل المشاريع',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!formData.category) {
        notifications.show({
          title: 'خطأ',
          message: 'يرجى اختيار تصنيف المشروع',
          color: 'red',
        });
        return;
      }

      const projectData = {
        ...formData,
        technologies: [] // Empty array since we're not using technologies anymore
      };

      if (editingProject) {
        await updateProject(editingProject._id, projectData);
        notifications.show({
          title: 'تم التحديث',
          message: 'تم تحديث المشروع بنجاح',
          color: 'green',
        });
      } else {
        await createProject(projectData);
        notifications.show({
          title: 'تم الإضافة',
          message: 'تم إضافة المشروع بنجاح',
          color: 'green',
        });
      }
      close();
      fetchProjects();
      setFormData({
        title: '',
        description: '',
        image: '',
        category: '' as ProjectCategory,
        githubLink: '',
        liveLink: '',
        technologies: []
      });
      setEditingProject(null);
    } catch (error) {
      notifications.show({
        title: 'خطأ',
        message: 'حدث خطأ أثناء حفظ المشروع',
        color: 'red',
      });
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      image: project.image,
      category: project.category,
      githubLink: project.githubLink || '',
      liveLink: project.liveLink || '',
      technologies: project.technologies
    });
    open();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا المشروع؟')) {
      try {
        await deleteProject(id);
        notifications.show({
          title: 'تم الحذف',
          message: 'تم حذف المشروع بنجاح',
          color: 'green',
        });
        fetchProjects();
      } catch (error) {
        notifications.show({
          title: 'خطأ',
          message: 'حدث خطأ أثناء حذف المشروع',
          color: 'red',
        });
      }
    }
  };

  if (loading) {
    return (
      <Container size="lg">
        <Title order={2} mb="xl">
          إدارة المشاريع
        </Title>
        <Text>جاري التحميل...</Text>
      </Container>
    );
  }

  return (
    <Container size="lg">
      <Group justify="space-between" mb="xl">
        <Title order={2}>إدارة المشاريع</Title>
        <Button
          onClick={() => {
            setEditingProject(null);
            setFormData({
              title: '',
              description: '',
              image: '',
              category: '' as ProjectCategory,
              githubLink: '',
              liveLink: '',
              technologies: []
            });
            open();
          }}
          leftSection={<IconPlus size={20} />}
        >
          إضافة مشروع
        </Button>
      </Group>

      <Stack>
        {projects.length === 0 ? (
          <Text c="dimmed" ta="center">
            لا توجد مشاريع حالياً
          </Text>
        ) : (
          projects.map((project) => (
            <Card key={project._id} withBorder>
              <Group justify="space-between" align="flex-start">
                <div style={{ flex: 1 }}>
                  <Group justify="space-between" align="center" mb="xs">
                    <Text fw={700} size="lg">
                      {project.title}
                    </Text>
                    <Text c="dimmed" size="sm">
                      {PROJECT_CATEGORIES.find(cat => cat.value === project.category)?.label || project.category}
                    </Text>
                  </Group>
                  <Text size="sm" c="dimmed" mb="md">
                    {project.description}
                  </Text>
                  {project.image && (
                    <Text size="sm" c="dimmed" mb="xs">
                      رابط الصورة: {project.image}
                    </Text>
                  )}
                  {project.liveLink && (
                    <Text size="sm" c="dimmed">
                      رابط المشروع: {project.liveLink}
                    </Text>
                  )}
                </div>
                <Group>
                  <Button
                    variant="light"
                    onClick={() => handleEdit(project)}
                    leftSection={<IconEdit size={20} />}
                  >
                    تعديل
                  </Button>
                  <Button
                    variant="light"
                    color="red"
                    onClick={() => handleDelete(project._id)}
                    leftSection={<IconTrash size={20} />}
                  >
                    حذف
                  </Button>
                </Group>
              </Group>
            </Card>
          ))
        )}
      </Stack>

      <Modal
        opened={opened}
        onClose={close}
        title={editingProject ? 'تعديل المشروع' : 'إضافة مشروع جديد'}
        size="lg"
      >
        <form onSubmit={handleSubmit}>
          <TextInput
            label="اسم المشروع"
            placeholder="أدخل اسم المشروع"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            mb="md"
          />

          <Select
            label="نوع المشروع"
            placeholder="اختر نوع المشروع"
            data={PROJECT_CATEGORIES}
            value={formData.category}
            onChange={(value) => setFormData({ ...formData, category: (value || '') as ProjectCategory })}
            required
            mb="md"
          />

          <Textarea
            label="وصف المشروع"
            placeholder="اكتب وصفاً للمشروع"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
            mb="md"
            minRows={3}
          />

          <TextInput
            label="رابط الصورة"
            placeholder="أدخل رابط صورة المشروع"
            value={formData.image}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            required
            mb="md"
          />

          <TextInput
            label="رابط المشروع"
            placeholder="أدخل رابط المشروع (اختياري)"
            value={formData.liveLink}
            onChange={(e) => setFormData({ ...formData, liveLink: e.target.value })}
            mb="xl"
          />

          <Group justify="flex-end">
            <Button variant="light" onClick={close}>
              إلغاء
            </Button>
            <Button type="submit">
              {editingProject ? 'تحديث المشروع' : 'إضافة المشروع'}
            </Button>
          </Group>
        </form>
      </Modal>
    </Container>
  );
} 