import { Redirect, Slot } from 'expo-router';

import { useAuth } from '~/provider/AuthProvider';

export default function AuthLayout() {
  const { isAuthenticated } = useAuth();
  //console.log("AuthLayout");
  if (isAuthenticated) {
    return <Redirect href="/" />;
  }

  return <Slot />;
}
