import { useProfiles } from "@/api/users/user";
import { View, Text } from "@/components/Themed";
import { Link } from "expo-router";
import { FlatList, Pressable, StyleSheet } from "react-native";

const ContactsScreen = () => {
	const { data: profiles } = useProfiles();

	return (
		<View>
			<FlatList
				data={profiles}
				renderItem={({ item }) => (
					<Link href={`/contacts/${item.id}`} asChild>
						<Pressable>
							<Text style={styles.item}>{item.username}</Text>
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
	item: {
		padding: 10,
		fontSize: 18,
		height: 44,
	},
});
