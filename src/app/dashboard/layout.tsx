'use client';

import DashboardLayout from 'src/layouts/dashboard';
import { AuthGuard, RoleBasedGuard } from 'src/auth/guard';

import { UsersProvider } from '../contexts/users/users-provider';
import { MissionsProvider } from '../contexts/missions/missions-provider';
import { BadgesProvider } from '../contexts/badges/badges-provider';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <AuthGuard>
      <RoleBasedGuard>
        <UsersProvider>
          <MissionsProvider>
            <BadgesProvider>
              <DashboardLayout>{children}</DashboardLayout>
            </BadgesProvider>
          </MissionsProvider>
        </UsersProvider>
      </RoleBasedGuard>
    </AuthGuard>
  );
}
