'use client';


import { usePathname } from 'next/navigation';

import Card from '@mui/material/Card';
import Container from '@mui/material/Container';

import { useUser } from 'src/hooks/use-user-detail';

import { _userAbout } from 'src/_mock';

import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';

import ProfileHome from '../profile-home';
import ProfileCover from '../profile-cover';

// ----------------------------------------------------------------------

const TABS = [
  {
    value: 'profile',
    label: 'Profile',
    icon: <Iconify icon="solar:user-id-bold" width={24} />,
  },
  {
    value: 'followers',
    label: 'Followers',
    icon: <Iconify icon="solar:heart-bold" width={24} />,
  },
  {
    value: 'friends',
    label: 'Friends',
    icon: <Iconify icon="solar:users-group-rounded-bold" width={24} />,
  },
  {
    value: 'gallery',
    label: 'Gallery',
    icon: <Iconify icon="solar:gallery-wide-bold" width={24} />,
  },
];

// ----------------------------------------------------------------------

export default function UserProfileView() {
  const settings = useSettingsContext();

  const pathname = usePathname()
  const user = pathname.split('/').filter(Boolean).pop()

  const { data:userData, isLoading } = useUser(user!);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <Card
        sx={{
          mb: 3,
          height: 290,
        }}
      >
        <ProfileCover
          role={userData?.email}
          name={userData?.username}
          avatarUrl={userData?.avatarUrl}
          coverUrl={_userAbout.coverUrl}
        />
      </Card>
      {!isLoading && <ProfileHome userInfo={userData!}/>}
    </Container>
  );
}
