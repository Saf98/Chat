import { View, Text, StyleSheet, Alert, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import Colors from "@constants/Colors";
import { Link } from "expo-router";
import { supabase } from "src/lib/supabase";
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

		if (error) {
			Alert.alert("Please enter credentials");
		}
		setLoading(false);
	}

	return (
		<View style={styles.container}>
			<View style={styles.card}>
				<Text style={{ fontSize: 30, fontWeight: 600, textAlign: "center" }}>
					Create an account
				</Text>
			</View>
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

			<TouchableOpacity
				onPress={handleSubmit(signUpWithEmail)}
				style={styles.button}
				disabled={loading}
			>
				<Text style={{ color: "white", fontSize: 18 }}>
					{loading ? "Creating account..." : "Create account"}
				</Text>
			</TouchableOpacity>
			<Text style={styles.textButton}>
				Already have an account? &nbsp;
				<Link style={{ color: Colors.light.tint }} href="/sign-in">
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
		textAlign: "center",
		alignSelf: "center",
		fontWeight: "bold",
		marginVertical: 10,
	},
});

export default SignUpScreen;
