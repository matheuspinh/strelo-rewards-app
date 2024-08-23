'use client';

import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

import DashboardLayout from 'src/layouts/dashboard';
import { AuthGuard, RoleBasedGuard } from 'src/auth/guard';

import { UsersProvider } from '../contexts/users/users-provider';
import { BadgesProvider } from '../contexts/badges/badges-provider';
import { MissionsProvider } from '../contexts/missions/missions-provider';
import { PrivilegesProvider } from '../contexts/privileges/privileges-provider';
import { LevelsProvider } from '../contexts/levels/levels-provider';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <AuthGuard>
      <RoleBasedGuard>
        <UsersProvider>
          <LevelsProvider>
          <PrivilegesProvider>
            <MissionsProvider>
              <BadgesProvider>
                <DashboardLayout>
                <ToastContainer
                    position="bottom-right"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="light"
                  />
                  {children}
                  </DashboardLayout>
              </BadgesProvider>
            </MissionsProvider>
          </PrivilegesProvider>
          </LevelsProvider>
        </UsersProvider>
      </RoleBasedGuard>
    </AuthGuard>
  );
}
