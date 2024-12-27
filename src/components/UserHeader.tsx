import React, { useEffect, useState } from "react";
import {
	View,
	Text,
	StyleSheet,
	Pressable,
	TextInput,
	Platform,
} from "react-native";
import Avatar from "./Avatar";
import { updateUsername, useLoggedInUserProfile } from "@/api/users/user";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { Link, router } from "expo-router";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import Button from "./Button";

const UserHeader = () => {
	const [username, setUsername] = useState<string>("");

	const { data: profile, isLoading, error } = useLoggedInUserProfile();
	// const [status, setStatus] = useState("");
	const [loading, setLoading] = useState(false);

	const queryClient = useQueryClient();
	// const { mutate: updateUsername } = useUpdateUsername();

	const handleNewUsername = ({ username }: any) => {
		setLoading(true);
		updateUsername({ username });
		setUsername("");
		setLoading(false);
	};

	useEffect(() => {
		const subscription = supabase
			.channel("public:profiles")
			.on(
				"postgres_changes",
				{ event: "*", schema: "public", table: "profiles" },
				() => {
					queryClient.invalidateQueries({
						queryKey: ["loggedInUserProfile"],
					});
				}
			)
			.subscribe();

		return () => {
			supabase.removeChannel(subscription);
		};
	}, [queryClient, supabase]);

	return (
		<View style={styles.container}>
			<View style={styles.contact}>
				<Avatar
					frameSize={75}
					avatarSize={60}
					marginLeft={5}
					marginBottom={3}
					radius={2}
				/>
				<View style={styles.content}>
					<Text
						style={{
							fontWeight: "500",
							fontSize: 18,
							color: "rgb(17 71 164)",
						}}
					>
						{profile?.username}
					</Text>
					<Text
						style={{
							fontWeight: "400",
							fontSize: 14,
							color: "rgb(17 71 164)",
						}}
					>
						{profile ? "(Online)" : "(Away)"}
					</Text>
					<Text
						style={{
							fontSize: 12,
							fontStyle: "italic",
							color: "rgb(17 71 164)",
						}}
					>
						{profile?.status || "Update my status..."}
					</Text>
				</View>
				<View style={styles.nav}>
					<Pressable onPress={() => router.back()}>
						<FontAwesome6 name="arrow-left-long" size={25} color="#52689f" />
					</Pressable>
				</View>
			</View>
			<View>
				<TextInput value={username} onChangeText={setUsername} />
				<Button
					disabled={loading}
					text={loading ? "Uodating..." : "Set username"}
					onPress={async () => handleNewUsername({ username })}
				/>
			</View>
		</View>
	);
};

export default UserHeader;

const styles = StyleSheet.create({
	container: {
		height: Platform.OS === "ios" ? 200 : null,
		marginTop: Platform.OS === "ios" ? 80 : null,
		backgroundColor: "#ecf2f6",
	},
	contact: {
		position: "relative",
		flexGrow: 0,
		flexShrink: 1,
		flexDirection: "row",
		flexWrap: "nowrap",
		padding: 10,
		alignItems: "center",
	},
	content: {
		padding: 10,
	},
	nav: {
		position: "absolute",
		padding: 10,
		width: 50,
		height: "auto",
		alignSelf: "flex-start",
		alignItems: "center",
		top: 10,
		right: 20,
	},
});
