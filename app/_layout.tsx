import { Stack } from "expo-router";
import { useState, useEffect } from "react";

export default function RootLayout() {
	return (
		<Stack>
			<Stack.Screen name="index" options={{ title: "Home" }} />
			<Stack.Screen name="register" options={{ title: "Register" }} />
		</Stack>
	);
}
