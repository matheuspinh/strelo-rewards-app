'use client';

import DashboardLayout from 'src/layouts/dashboard';
import { AuthGuard, RoleBasedGuard } from 'src/auth/guard';

import { UsersProvider } from '../contexts/users/users-provider';
import { BadgesProvider } from '../contexts/badges/badges-provider';
import { MissionsProvider } from '../contexts/missions/missions-provider';
import { PrivilegesProvider } from '../contexts/privileges/privileges-provider';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <AuthGuard>
      <RoleBasedGuard>
        <UsersProvider>
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
        </UsersProvider>
      </RoleBasedGuard>
    </AuthGuard>
  );
}
