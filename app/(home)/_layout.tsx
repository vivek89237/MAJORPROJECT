import { Redirect, Slot } from 'expo-router';

import { useAuth } from '~/provider/AuthProvider';

export default function HomeLayout() {
  const { isAuthenticated, session } = useAuth();
  //console.log("isAuthenticated", isAuthenticated);
  //console.log("homeLayout");

  if (!isAuthenticated) {
    return <Redirect href="/auth" />;
  }

  return <Slot />;
}
