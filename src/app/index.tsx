import { View, Text, ActivityIndicator } from "react-native";
import React from "react";
import Button from "../components/Button";
import { Link, Redirect } from "expo-router";
import { useAuth } from "@/providers/AuthProvider";
import { supabase } from "@/lib/supabase";

const index = () => {
	const { session, loading, isAdmin } = useAuth();

	if (loading) {
		return <ActivityIndicator />;
	}

	if (!session) {
		console.log("not logged in", session);
		return <Redirect href={"/sign-in"} />;
	}

	// if (!isAdmin) {
	// 	<Redirect href={"/(user)"} />
	// 	return;
	// }

	// if (session.user) {
	// 	console.log("logged in", session.user);
	// }

	return (
		<View style={{ flex: 1, justifyContent: "center", padding: 10 }}>
			<Button text="User" />
			<Button text="Admin" />
			<Button onPress={() => supabase.auth.signOut()} text="Sign out" />
		</View>
	);
};

export default index;
