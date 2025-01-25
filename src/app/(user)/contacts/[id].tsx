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
	View,
	StyleSheet,
	ActivityIndicator,
	FlatList,
	SafeAreaView,
	Pressable,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Animated, {
	useSharedValue,
	withTiming,
	useAnimatedStyle,
	withRepeat,
	withSequence,
} from "react-native-reanimated";
import CustomInput from "@/components/CustomInput";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import { AntDesign } from "@expo/vector-icons";

export default function MessageScreen() {
	const [newMessage, setNewMessage] = useState<NewMessageType[]>([]);
	const { id: receiverId } = useLocalSearchParams();
	const { isLoading } = useProfile(receiverId as string);
	const { data: userProfile } = useLoggedInUserProfile();
	const { data: messages } = useReadMessage(
		userProfile?.id,
		receiverId as string
	);

	const ref = useRef<FlatList>(null);

	type NewMessageType = {
		id: string;
		message: string;
		created_at: string;
		sender_id: string;
		receiver_id: string;
		read: boolean;
		nudge: boolean;
	};

	const queryClient = useQueryClient();

	const { control, handleSubmit, reset } = useForm();

	function handleNewMessage(
		payload: RealtimePostgresChangesPayload<NewMessageType>
	) {
		if (
			!payload ||
			!payload.new ||
			typeof payload.new !== "object" ||
			payload.new === null
		) {
			return;
		}
		const newMessage = payload.new;
		setNewMessage((prevMessages: any) => [newMessage, ...prevMessages]);
	}

	useEffect(() => {
		const subscription = supabase
			.channel("messages")
			.on<NewMessageType>(
				"postgres_changes",
				{
					event: "INSERT",
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
	}, [newMessage]);

	const { mutate: insertMessage } = useInsertMessage();

	const scrollToBottom = () => {
		ref.current?.scrollToEnd({
			animated: true,
		});
	};

	const handleSendMessage = async (data: any): Promise<void> => {
		try {
			const { message } = data;

			insertMessage(
				{
					sender_id: userProfile?.id,
					receiver_id: receiverId as string,
					message: message as string,
				},
				{
					onSuccess: () => {
						console.log("Message sent successfully!");
						reset();
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

	const animationStyle = useAnimatedStyle(() => ({
		transform: [{ translateX: offset.value }],
	}));

	const OFFSET = 20;
	const TIME = 60;

	function playAnimation() {
		offset.value = withSequence(
			withTiming(-OFFSET, { duration: TIME / 2 }),
			// shake between -OFFSET and OFFSET 5 times
			withRepeat(withTiming(OFFSET, { duration: TIME }), 5, true),
			// go back to 0 at the end
			withTiming(0, { duration: TIME / 2 })
		);
	}

	const Message = ({ item }: any) => {
		return item.sender_id === userProfile.id ? (
			<Animated.View style={[styles.sender, animationStyle]}>
				<Text
					style={{
						color: "#ffffff",
					}}
				>
					{item.message}
				</Text>
			</Animated.View>
		) : (
			<Animated.View style={[styles.receiver, animationStyle]}>
				<Text
					style={{
						color: "#7b99cd",
					}}
				>
					{item.message}
				</Text>
			</Animated.View>
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
						renderItem={Message}
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
					borderRadius: 16,
					backgroundColor: "white",
				}}
			>
				<View
					style={{
						maxWidth: "auto",
						flexShrink: 1,
						flexGrow: 0,
						alignSelf: "center",

						marginLeft: 10,
					}}
				>
					<Pressable onPress={playAnimation} hitSlop={10}>
						<AntDesign name="shake" size={20} color="black" />
					</Pressable>
				</View>

				<CustomInput
					control={control}
					name={"message"}
					placeholder={"Enter a message"}
					editable={!isLoading}
					secureTextEntry={false}
					rules={{
						required: "message is required",
						minLength: {
							value: 1,
							message: "Please enter message",
						},
					}}
					styles={messageStyle}
				/>
				<View
					style={{
						maxWidth: "auto",
						backgroundColor: "white",
						flexShrink: 1,
						flexGrow: 0,
						alignSelf: "center",
						marginRight: 20,
					}}
				>
					<Pressable
						onPress={handleSubmit(handleSendMessage)}
						disabled={isLoading}
						hitSlop={10}
					>
						<MaterialIcons name="send" size={28} color="black" />
					</Pressable>
				</View>
			</View>
		</SafeAreaView>
	);
}

const messageStyle = StyleSheet.create({
	inputContainer: {
		flexGrow: 1,
		flexShrink: 0,
		flexDirection: "row",
		margin: 10,
		padding: 2,
		backgroundColor: "white",
	},
	input: {
		paddingTop: 0,
		paddingBottom: 0,
	},
});

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
