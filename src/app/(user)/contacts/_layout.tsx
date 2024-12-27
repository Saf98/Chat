import UserHeader from "@/components/UserHeader";
import { useAuth } from "@/providers/AuthProvider";
import { Redirect, Stack } from "expo-router";

export default function TabIndex() {
	const { session } = useAuth();
	if (!session) return <Redirect href={"/(auth)/sign-in"} />;
	return (
		<Stack
			screenOptions={{
				header: () => <UserHeader />,
			}}
		/>
	);
}
