import { supabase } from "@/lib/supabase";
import { View, Text, Button, TextInput, StyleSheet } from "react-native";
import {
	useLoggedInUserProfile,
	useProfiles,
	updateUsername,
} from "@/api/users/user";
import { useState } from "react";
import { Link } from "expo-router";
import Colors from "@/constants/Colors";

const ProfileScreen = () => {
	const [username, setUsername] = useState("");

	const { data: profile, isLoading, error } = useLoggedInUserProfile();

	const isUsername = profile?.username;

	return (
		<View>
			{!isUsername && (
				<View>
					<Text>Username: {isUsername}</Text>
					<TextInput value={username} onChangeText={setUsername} />
					<Button
						title="Set username"
						onPress={async () => await updateUsername({ username })}
					/>
				</View>
			)}
			<Text>Username: {isUsername}</Text>

			<Button
				title="Sign out"
				onPress={async () => await supabase.auth.signOut()}
			/>
			<Link href={"/(user)/contacts"} style={styles.textButton}>
				View Contacts
			</Link>
		</View>
	);
};

export default ProfileScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingTop: 22,
	},
	item: {
		padding: 10,
		fontSize: 18,
		height: 44,
	},
	textButton: {
		alignSelf: "center",
		fontWeight: "bold",
		color: Colors.light.tint,
		marginVertical: 10,
	},
});
