import { View, Text, StyleSheet, Alert, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import Colors from "../../constants/Colors";
import { Link, Redirect, Stack } from "expo-router";
import { supabase } from "src/lib/supabase";
import { useAuth } from "@/providers/AuthProvider";
import CustomInput from "@/components/CustomInput";
import { useForm } from "react-hook-form";
import { SafeAreaView } from "react-native-safe-area-context";

const SignInScreen = () => {
	const [loading, setLoading] = useState(false);

	const { session } = useAuth();

	const { control, handleSubmit } = useForm();

	if (session) {
		return <Redirect href={"/(user)/contacts"} />;
	}

	async function signInWithEmail({ email, password }: any) {
		setLoading(true);
		const { error } = await supabase.auth.signInWithPassword({
			email,
			password,
		});

		if (error) Alert.alert("Please enter credentials");
		setLoading(false);
	}

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.card}>
				<Text style={{ fontSize: 30, fontWeight: 600, textAlign: "center" }}>
					Sign Into Your Account
				</Text>
			</View>
			<CustomInput
				control={control}
				name={"email"}
				placeholder={"test@supabase.com"}
				secureTextEntry={false}
				rules={{ required: "Email is required" }}
			/>
			<CustomInput
				control={control}
				name={"password"}
				placeholder={"password"}
				secureTextEntry={true}
				rules={{
					required: "Password is required",
					minLength: { value: 6, message: "Minimum of 6 characters required" },
				}}
			/>

			<TouchableOpacity
				onPress={handleSubmit(signInWithEmail)}
				style={styles.button}
				disabled={loading}
			>
				<Text style={{ color: "white", fontSize: 18 }}>Login</Text>
			</TouchableOpacity>
			<Link href="/sign-up" style={styles.textButton}>
				Create an account
			</Link>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		padding: 20,
		justifyContent: "center",
		flex: 1,
	},
	card: {
		padding: 20,
		alignContent: "center",
	},
	button: {
		borderRadius: 15,
		alignItems: "center",
		backgroundColor: Colors.light.tint,
		padding: 20,
	},
	textButton: {
		alignSelf: "center",
		fontWeight: "bold",
		color: Colors.light.tint,
		marginVertical: 10,
	},
});

export default SignInScreen;
