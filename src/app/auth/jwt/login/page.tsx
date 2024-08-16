import { JwtLoginView } from 'src/sections/auth/jwt';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Strelo Rewards: Login',
};

export default function LoginPage() {
  return <JwtLoginView />;
}
