import {
	KeyboardAvoidingView,
	Text,
	TextInput,
	View,
	Button,
	ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { Link } from "expo-router";
export default function Index() {
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [loading, setLoading] = useState<Boolean>(false);
	type Inputs = {
		example: string;
		exampleRequired: string;
	};

	const registerEmail = () => {
		return;
	};
	const registerPassword = () => {
		return;
	};
	const signUp = async () => {
		// setLoading(true);
		// try {
		// 	const user = await auth().createUserWithEmailAndPassword(email, password);
		// } catch (e: any) {
		// 	const error = e as FirebaseError;
		// 	alert(error?.message);
		// } finally {
		// 	setLoading(false);
		// }
		return;
	};

	const signIn = async () => {
		// setLoading(true);
		// try {
		// 	const user = await auth().createUserWithEmailAndPassword(email, password);
		// } catch (e: any) {
		// 	const error = e as FirebaseError;
		// 	alert(error?.message);
		// } finally {
		// 	setLoading(false);
		// }
		return;
	};

	return (
		<View>
			<KeyboardAvoidingView behavior="padding">
				<Text>Enter Your Email</Text>
				<TextInput value="" onChangeText={registerEmail} />
				<Text>Enter Your Password</Text>
				<TextInput value="" onChangeText={registerPassword} />
				<Link href="/register">Go to Register screen</Link>
				{loading ? (
					<ActivityIndicator />
				) : (
					<Button onPress={signUp} title="Sign Up" />
				)}
			</KeyboardAvoidingView>
		</View>
	);
}
