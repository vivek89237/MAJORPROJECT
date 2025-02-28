import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ScooterProvider from '~/provider/ScooterProvider';
import CustomerProvider from '~/provider/CustomerProvider';
import { BasketProvider } from "../Context";
import AuthProvider from '~/provider/AuthProvider';
import { StatusBar } from 'expo-status-bar';
import OrderProvider from '~/components/VendorPartMap/OrderProvider';
export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }} >
      <AuthProvider>
        <CustomerProvider>
          <BasketProvider>
            <OrderProvider>
            <ScooterProvider>
              <Stack screenOptions={{ headerShown: false }} />
              <StatusBar style="auto" />
            </ScooterProvider>
            </OrderProvider>
          </BasketProvider>
      </CustomerProvider>
      </AuthProvider>
    </GestureHandlerRootView>

  )
}
