import {
	useProfile,
	useInsertMessage,
	useLoggedInUserProfile,
} from "@/api/users/user";
import { useLocalSearchParams } from "expo-router/build/hooks";
import { useState } from "react";
import {
	Button,
	Text,
	TextInput,
	View,
	StyleSheet,
	ActivityIndicator,
} from "react-native";

export default function MessageScreen() {
	const [message, setMessage] = useState("");

	const { id: receiverId } = useLocalSearchParams();

	const { data: profile, isLoading } = useProfile(receiverId as string);
	const { data: userProfile } = useLoggedInUserProfile();

	const { mutate: insertMessage } = useInsertMessage();

	const handleSendMessage = async () => {
		try {
			await insertMessage(
				{
					sender_id: userProfile?.id,
					receiver_id: receiverId as string,
					message,
				},
				{
					onSuccess: () => {
						alert("Message sent successfully!");
						setMessage(""); // Clear input
					},
					onError: (error: any) => {
						console.error(error);
						alert("Failed to send the message.");
					},
				}
			);
		} catch (err) {
			console.error(err);
			alert("An unexpected error occurred.");
		}
	};

	return (
		<View style={styles.container}>
			<Text>Messaging {profile?.username}</Text>
			{isLoading && <ActivityIndicator />}
			<TextInput
				placeholder="Type your message..."
				value={message}
				onChangeText={setMessage}
				editable={!isLoading} // Disable input while sending
			/>
			<Button title="Send" onPress={handleSendMessage} disabled={isLoading} />
		</View>
	);
}

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
