import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ScooterProvider from '~/provider/ScooterProvider';
import CustomerProvider from '~/provider/CustomerProvider';
import { BasketProvider } from "../provider/Context";
import AuthProvider from '~/provider/AuthProvider';
import { StatusBar } from 'expo-status-bar';

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }} >
      <AuthProvider>
        <CustomerProvider>
          <BasketProvider>
            <ScooterProvider>
              <Stack screenOptions={{ headerShown: false }} />
              <StatusBar style="auto" />
            </ScooterProvider>
          </BasketProvider>
      </CustomerProvider>
      </AuthProvider>
    </GestureHandlerRootView>

  )
}
