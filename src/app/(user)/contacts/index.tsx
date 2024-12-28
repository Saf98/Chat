import { useLoggedInUserProfile, useProfiles } from "@/api/users/user";
import Avatar from "@/components/Avatar";
import { View, Text } from "@/components/Themed";
import { Link } from "expo-router";
import { FlatList, Pressable, StyleSheet } from "react-native";

const ContactsScreen = () => {
	const { data: profiles } = useProfiles();
	const { data: profile, isLoading, error } = useLoggedInUserProfile();
	const filteredProfiles = profiles?.filter((el) => el.id !== profile.id);
	return (
		<View>
			<FlatList
				data={filteredProfiles}
				renderItem={({ item }) => (
					<Link href={`/contacts/${item.id}`} asChild>
						<Pressable>
							<View style={styles.contact}>
								<Avatar
									frameSize={49}
									avatarSize={38}
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
										{item.username}
									</Text>
									<Text
										style={{
											fontSize: 12,
											fontStyle: "italic",
											color: "rgb(17 71 164)",
										}}
									>
										{item.status || "Update my status..."}
									</Text>
								</View>
							</View>
						</Pressable>
					</Link>
				)}
			/>
		</View>
	);
};

export default ContactsScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingTop: 22,
	},
	contact: {
		flex: 1,
		flexDirection: "row",
		flexWrap: "wrap",
		padding: 10,
		alignItems: "center",
	},
	content: {
		padding: 10,
	},
});
