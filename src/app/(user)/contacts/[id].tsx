import {
	useProfile,
	useInsertMessage,
	useLoggedInUserProfile,
	useReadMessage,
} from "@/api/users/user";
import { supabase } from "@/lib/supabase";
import { useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router/build/hooks";
import { useEffect, useState } from "react";
import {
	Button,
	Text,
	TextInput,
	View,
	StyleSheet,
	ActivityIndicator,
	FlatList,
} from "react-native";

export default function MessageScreen() {
	const [message, setMessage] = useState<any>("");

	const { id: receiverId } = useLocalSearchParams();

	const { data: profile, isLoading } = useProfile(receiverId as string);
	const { data: userProfile } = useLoggedInUserProfile();
	const { data: messages } = useReadMessage(
		userProfile?.id,
		receiverId as string
	);

	const queryClient = useQueryClient();

	const handleNewMessage = (payload: { new: any }) => {
		setMessage((prevMessages: any) => [payload.new.message, ...prevMessages]);
	};

	useEffect(() => {
		const subscription = supabase
			.channel("messages")
			.on(
				"postgres_changes",
				{
					event: "*",
					schema: "public",
					table: "messages",
				},
				(payload) => {
					handleNewMessage(payload);
					queryClient.invalidateQueries({
						queryKey: ["messages", userProfile.id, receiverId],
					});
				}
			)
			.subscribe();

		return () => {
			supabase.removeChannel(subscription);
		};
	}, [userProfile.id, receiverId, messages]);

	// useRealtimeReadUpdates(userProfile?.id, receiverId as string);

	// const allMessages = [...(messages ?? []), ...realtimeMessages].sort(
	// 	(a, b) =>
	// 		new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
	// );
	const { mutate: insertMessage } = useInsertMessage();

	const handleSendMessage = async () => {
		try {
			insertMessage(
				{
					sender_id: userProfile?.id,
					receiver_id: receiverId as string,
					message,
				},
				{
					onSuccess: () => {
						console.log("Message sent successfully!");
						setMessage(""); // Clear input
					},
					onError: (error: any) => {
						console.error(error);
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
			{messages && (
				<FlatList
					data={messages}
					keyExtractor={(item) => item.id}
					renderItem={({ item }) => {
						return item.sender_id === userProfile.id ? (
							<View
								style={{
									backgroundColor: "#8ea9d9",
									marginTop: 10,
									padding: 10,
									borderRadius: 15,
									alignSelf: "flex-end",
									borderTopRightRadius: 0,
								}}
							>
								<Text
									style={{
										color: "#ffffff",
									}}
								>
									{item.message}
								</Text>
							</View>
						) : (
							<View
								style={{
									backgroundColor: "#ffffff",
									marginTop: 10,
									padding: 10,
									borderRadius: 15,
									borderTopLeftRadius: 0,
									alignSelf: "flex-start",
								}}
							>
								<Text
									style={{
										color: "#7b99cd",
									}}
								>
									{item.message}
								</Text>
							</View>
						);
					}}
				/>
			)}
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
