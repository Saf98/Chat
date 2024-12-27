import React, { useEffect, useState } from "react";
import {
	View,
	Text,
	StyleSheet,
	Pressable,
	TextInput,
	Platform,
	Button,
	TouchableOpacity,
} from "react-native";
import Avatar from "./Avatar";
import { updateUsername, useLoggedInUserProfile } from "@/api/users/user";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { Link, router } from "expo-router";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
// import Button from "./Button";

const UserHeader = () => {
	const [username, setUsername] = useState<string>("");
	const [edit, setEdit] = useState<Boolean>(false);
	const { data: profile, isLoading, error } = useLoggedInUserProfile();
	// const [status, setStatus] = useState("");
	const [loading, setLoading] = useState(false);

	const queryClient = useQueryClient();
	// const { mutate: updateUsername } = useUpdateUsername();

	const handleNewUsername = ({ username }: any) => {
		setLoading(true);
		if (edit) {
			updateUsername({ username });
		}
		setLoading(false);
		setEdit(!edit);
	};

	useEffect(() => {
		if (profile) {
			setUsername(profile.username);
		}
	}, [profile]);

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
					<View style={styles.username}>
						{edit ? (
							<TextInput
								value={username}
								onChangeText={setUsername}
								style={{
									fontWeight: "500",
									fontSize: 18,
									color: "rgb(17 71 164)",
									backgroundColor: "white",
									paddingTop: 0,
									paddingBottom: 0,
								}}
							/>
						) : (
							<Text
								style={{
									fontWeight: "500",
									fontSize: 18,
									color: "rgb(17 71 164)",
								}}
							>
								{profile?.username}
							</Text>
						)}
						<View style={styles.editMode}>
							<TouchableOpacity
								onPress={async () => handleNewUsername({ username })}
							>
								<FontAwesome6
									name={edit ? "check" : "pencil"}
									size={18}
									color="#52689f"
								/>
							</TouchableOpacity>
						</View>
					</View>
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
				{/* <TextInput value={username} onChangeText={setUsername} /> */}
				{/* <Button
					// disabled={loading}
					text={edit ? "Updating..." : "Set username"}
					// onPress={async () => handleNewUsername({ username })}
					onPress={() => setEdit(!edit)}
				/> */}
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
	username: {
		flexDirection: "row",
		padding: 0,
	},
	editMode: {
		marginLeft: 6,
		padding: 2,
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
