import { AppShell, Button, Stack } from '@mantine/core';
import { IconHome, IconBriefcase, IconMail, IconLogout, IconUser, IconTools } from '@tabler/icons-react';
import { Link, useNavigate, Outlet } from 'react-router-dom';
import { logout } from '../services/api';

export function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
  };

  return (
    <AppShell
      navbar={{ width: 300, breakpoint: 'sm' }}
      padding="md"
    >
      <AppShell.Navbar p="md">
        <Stack>
          <Button
            component={Link}
            to="/admin"
            variant="subtle"
            leftSection={<IconHome size={20} />}
            fullWidth
          >
            الرئيسية
          </Button>
          <Button
            component={Link}
            to="/admin/personal-info"
            variant="subtle"
            leftSection={<IconUser size={20} />}
            fullWidth
          >
            المعلومات الشخصية
          </Button>
          <Button
            component={Link}
            to="/admin/projects"
            variant="subtle"
            leftSection={<IconBriefcase size={20} />}
            fullWidth
          >
            المشاريع
          </Button>
          <Button
            component={Link}
            to="/admin/skills"
            variant="subtle"
            leftSection={<IconTools size={20} />}
            fullWidth
          >
            المهارات
          </Button>
          <Button
            component={Link}
            to="/admin/messages"
            variant="subtle"
            leftSection={<IconMail size={20} />}
            fullWidth
          >
            الرسائل
          </Button>
          <Button
            onClick={handleLogout}
            variant="subtle"
            color="red"
            leftSection={<IconLogout size={20} />}
            fullWidth
            style={{ marginTop: 'auto' }}
          >
            تسجيل الخروج
          </Button>
        </Stack>
      </AppShell.Navbar>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
} 