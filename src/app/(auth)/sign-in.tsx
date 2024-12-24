import { View, Text, TextInput, StyleSheet, Alert } from "react-native";
import React, { useState } from "react";
import Button from "@components/Button";
import Colors from "../../constants/Colors";
import { Link, Redirect, Stack } from "expo-router";
import { supabase } from "src/lib/supabase";
import { useAuth } from "@/providers/AuthProvider";
import CustomInput from "@/components/CustomInput";
import { useForm } from "react-hook-form";

const SignInScreen = () => {
	const [loading, setLoading] = useState(false);

	const { session } = useAuth();

	const { control, handleSubmit } = useForm();

	// if (session) {
	// 	return <Redirect href={"/(user)/contacts"} />;
	// }

	async function signInWithEmail({ email, password }: any) {
		setLoading(true);
		const { error } = await supabase.auth.signInWithPassword({
			email,
			password,
		});

		if (error) Alert.alert(error.message);
		setLoading(false);
	}

	return (
		<View style={styles.container}>
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

			<Button
				onPress={handleSubmit(signInWithEmail)}
				disabled={loading}
				text={loading ? "Signing in..." : "Sign in"}
			/>
			<Link href="/sign-up" style={styles.textButton}>
				Create an account
			</Link>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		padding: 20,
		justifyContent: "center",
		flex: 1,
	},
	textButton: {
		alignSelf: "center",
		fontWeight: "bold",
		color: Colors.light.tint,
		marginVertical: 10,
	},
});

export default SignInScreen;
