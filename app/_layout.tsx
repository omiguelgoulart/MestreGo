import { Stack, usePathname, useRouter } from "expo-router";
import {
  useFonts,
  Inter_400Regular,
  Inter_600SemiBold,
} from "@expo-google-fonts/inter";
import { View, ActivityIndicator } from "react-native";
import { useEffect } from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

function AuthGate({ children }: { children: React.ReactNode }) {
  const { token, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const protectedRoutes = ["/", "/detalheComanda"];
    const isProtected = protectedRoutes.includes(pathname);

    if (!token && isProtected) {
      router.replace("/login");
    }

    if (token && pathname === "/login") {
      router.replace("/");
    }
  }, [token, loading, pathname, router]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <>{children}</>;
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <AuthProvider>
      <AuthGate>
        <Stack
          screenOptions={{
            headerTitleStyle: {
              fontFamily: "Inter_600SemiBold",
              fontWeight: "600",
            },
            headerBackTitleStyle: {
              fontFamily: "Inter_400Regular",
            },
            headerShown: false, // se preferir sem header
          }}
        />
      </AuthGate>
    </AuthProvider>
  );
}
