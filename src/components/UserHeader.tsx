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
	SafeAreaView,
} from "react-native";
import Avatar from "./Avatar";
import {
	updateStatus,
	updateUsername,
	useLoggedInUserProfile,
} from "@/api/users/user";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { Link, router } from "expo-router";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
// import Button from "./Button";

const UserHeader = () => {
	const [username, setUsername] = useState<string>("");
	const [editName, setEditName] = useState<Boolean>(false);
	const [editStatus, setEditStatus] = useState<Boolean>(false);
	const [status, setStatus] = useState("");
	const [loading, setLoading] = useState(false);
	const { data: profile, isLoading, error } = useLoggedInUserProfile();

	const queryClient = useQueryClient();
	// const { mutate: updateUsername } = useUpdateUsername();

	const handleNewUsername = ({ username }: any) => {
		setLoading(true);
		if (editName) {
			updateUsername({ username });
		}
		setLoading(false);
		setEditName(!editName);
	};

	const handleNewStatus = ({ status }: any) => {
		setLoading(true);
		if (editStatus) {
			updateStatus({ status });
		}
		setLoading(false);
		setEditStatus(!editStatus);
	};

	useEffect(() => {
		if (profile) {
			setUsername(profile.username);
			setStatus(profile.status);
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
		<SafeAreaView style={styles.container}>
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
						{editName ? (
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
									borderRadius: 25,
									width: 100,
									transitionDelay: "1000s",
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
									name={editName ? "check" : "pencil"}
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
					<View style={styles.status}>
						{editStatus ? (
							<TextInput
								value={status}
								onChangeText={setStatus}
								style={{
									fontWeight: "400",
									fontSize: 14,
									color: "rgb(17 71 164)",
									backgroundColor: "white",
									paddingTop: 0,
									paddingBottom: 0,
									fontStyle: "italic",
								}}
							/>
						) : (
							<Text
								style={{
									fontWeight: "400",
									fontSize: 14,
									color: "rgb(17 71 164)",
									fontStyle: "italic",
								}}
							>
								{profile?.status || "Set Status"}
							</Text>
						)}
						<View style={styles.editMode}>
							<TouchableOpacity
								onPress={async () => handleNewStatus({ status })}
							>
								<FontAwesome6
									name={editStatus ? "check" : "pencil"}
									size={14}
									color="#52689f"
								/>
							</TouchableOpacity>
						</View>
					</View>
				</View>
				<View style={styles.nav}>
					<Pressable onPress={() => router.back()}>
						<FontAwesome6 name="arrow-left-long" size={25} color="#52689f" />
					</Pressable>
				</View>
			</View>
			<View></View>
		</SafeAreaView>
	);
};

export default UserHeader;

const styles = StyleSheet.create({
	container: {
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
	status: {
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
