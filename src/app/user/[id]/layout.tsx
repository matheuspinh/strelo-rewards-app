'use client';

import { AuthGuard } from 'src/auth/guard';
import UserProfileLayout from 'src/layouts/user-profile';
import { UsersProvider } from 'src/app/contexts/users/users-provider';
// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <AuthGuard>
      <UsersProvider>
        <UserProfileLayout>{children}</UserProfileLayout>
      </UsersProvider>
    </AuthGuard>
  );
}