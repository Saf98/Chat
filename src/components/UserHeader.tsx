import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import Avatar from "./Avatar";
import { useLoggedInUserProfile } from "@/api/users/user";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { Link } from "expo-router";

const UserHeader = () => {
	const { data: profile, isLoading, error } = useLoggedInUserProfile();

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
					<Link href={`/(user)`} asChild>
						<Pressable>
							<FontAwesome6 name="arrow-left-long" size={25} color="#52689f" />
						</Pressable>
					</Link>
				</View>
			</View>
		</View>
	);
};

export default UserHeader;

const styles = StyleSheet.create({
	container: { height: 100, backgroundColor: "#ecf2f6" },
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
