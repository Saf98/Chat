import {
	useProfile,
	useInsertMessage,
	useLoggedInUserProfile,
	useReadMessage,
} from "@/api/users/user";
import { supabase } from "@/lib/supabase";
import { useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router/build/hooks";
import { useEffect, useRef, useState } from "react";
import {
	Text,
	TextInput,
	View,
	StyleSheet,
	ActivityIndicator,
	FlatList,
	SafeAreaView,
	Pressable,
	Button,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Animated, {
	useSharedValue,
	withTiming,
	useAnimatedStyle,
	withRepeat,
	withSequence,
} from "react-native-reanimated";
export default function MessageScreen() {
	const [message, setMessage] = useState<any>("");

	const { id: receiverId } = useLocalSearchParams();

	const { data: profile, isLoading } = useProfile(receiverId as string);
	const { data: userProfile } = useLoggedInUserProfile();
	const { data: messages } = useReadMessage(
		userProfile?.id,
		receiverId as string
	);
	const ref = useRef<FlatList>(null);

	const queryClient = useQueryClient();

	const handleNewMessage = (payload: any) => {
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

	useEffect(() => {
		scrollToBottom();
	}, [message]);

	const { mutate: insertMessage } = useInsertMessage();

	const scrollToBottom = () => {
		ref.current?.scrollToEnd({
			animated: true,
		});
	};

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
						setMessage("");
						scrollToBottom();
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

	const offset = useSharedValue<number>(0);

	const style = useAnimatedStyle(() => ({
		transform: [{ translateX: offset.value }],
	}));

	const OFFSET = 20;
	const TIME = 60;

	const handlePress = () => {
		offset.value = withSequence(
			withTiming(-OFFSET, { duration: TIME / 2 }),
			// shake between -OFFSET and OFFSET 5 times
			withRepeat(withTiming(OFFSET, { duration: TIME }), 5, true),
			// go back to 0 at the end
			withTiming(0, { duration: TIME / 2 })
		);
	};

	return (
		<SafeAreaView style={styles.container}>
			{isLoading && <ActivityIndicator />}
			{messages && (
				<View style={styles.wrapper}>
					<FlatList
						ref={ref}
						keyboardShouldPersistTaps="handled"
						inverted={false}
						onContentSizeChange={scrollToBottom}
						data={messages}
						keyExtractor={(item) => item.id}
						renderItem={({ item }) => {
							return item.sender_id === userProfile.id ? (
								<Animated.View style={[styles.sender, style]}>
									<Text
										style={{
											color: "#ffffff",
										}}
									>
										{item.message}
									</Text>
								</Animated.View>
							) : (
								<Animated.View style={[styles.receiver, style]}>
									<Text
										style={{
											color: "#7b99cd",
										}}
									>
										{item.message}
									</Text>
								</Animated.View>
							);
						}}
					/>
				</View>
			)}
			<View
				style={{
					flexGrow: 0,
					flexShrink: 0,
					flexDirection: "row",
					margin: 10,
					justifyContent: "space-between",
					padding: 12,
					borderRadius: 16,
					borderWidth: 2,
					borderColor: "black",
					backgroundColor: "white",
				}}
			>
				<TextInput
					placeholder="Type your message..."
					value={message}
					onChangeText={setMessage}
					editable={!isLoading}
					style={{ paddingTop: 0, paddingBottom: 0 }}
				/>
				<View style={{ maxWidth: "auto", backgroundColor: "white" }}>
					<Pressable onPress={handleSendMessage} disabled={isLoading}>
						<MaterialIcons name="send" size={28} color="black" />
					</Pressable>
				</View>
			</View>
			<Button title="nudge" onPress={handlePress} />
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingTop: 0,
	},
	wrapper: {
		flex: 1,
		backgroundColor: "none",
		padding: 10,
	},
	sender: {
		backgroundColor: "#8ea9d9",
		marginTop: 10,
		padding: 10,
		borderRadius: 15,
		alignSelf: "flex-end",
		borderTopRightRadius: 0,
	},
	receiver: {
		backgroundColor: "#ffffff",
		marginTop: 10,
		padding: 10,
		borderRadius: 15,
		borderTopLeftRadius: 0,
		alignSelf: "flex-start",
	},
	item: {
		padding: 10,
		fontSize: 18,
		height: 44,
		marginBottom: 70,
	},
	box: {
		width: 100,
		height: 100,
		margin: 50,
		borderRadius: 15,
		backgroundColor: "#b58df1",
	},
});
