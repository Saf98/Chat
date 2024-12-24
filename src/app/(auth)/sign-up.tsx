import { View, Text, TextInput, StyleSheet, Alert } from "react-native";
import React, { useState } from "react";
import Button from "@components/Button";
import Colors from "@constants/Colors";
import { Link, Stack } from "expo-router";
import { supabase } from "src/lib/supabase";
import Avatar from "@/components/Avatar";
import { useForm } from "react-hook-form";
import CustomInput from "@/components/CustomInput";
import { EMAIL_REGEX } from "@/constants/Utils";

const SignUpScreen = () => {
	const [loading, setLoading] = useState(false);
	const { control, handleSubmit, watch } = useForm();

	const passwordCheck = watch("password");

	async function signUpWithEmail({ email, password }: any) {
		setLoading(true);
		const { error } = await supabase.auth.signUp({ email, password });

		if (error) Alert.alert(error.message);
		setLoading(false);
	}

	return (
		<View style={styles.container}>
			<CustomInput
				control={control}
				name={"email"}
				placeholder={"email@user.com"}
				secureTextEntry={false}
				rules={{
					required: "Email is required",
					pattern: { value: EMAIL_REGEX, message: "Email is invalid" },
					minLength: { value: 6, message: "Minimum of 6 characters required" },
					maxLength: {
						value: 24,
						message: "Minimum of 24 characters required",
					},
				}}
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
			<CustomInput
				control={control}
				name={"password-repeat"}
				placeholder={"Repeat password"}
				secureTextEntry={true}
				rules={{
					required: "Password is required",
					validate: (value): true | "Password does not match" =>
						value === passwordCheck || "Password does not match",
				}}
			/>

			<Button
				onPress={handleSubmit(signUpWithEmail)}
				disabled={loading}
				text={loading ? "Creating account..." : "Create account"}
			/>
			<Text>
				Already have an account? &nbsp;
				<Link href="/sign-in" style={styles.textButton}>
					Sign in
				</Link>
			</Text>
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

export default SignUpScreen;
