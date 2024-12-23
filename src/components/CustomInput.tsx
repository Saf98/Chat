import { View, TextInput, StyleSheet, Text } from "react-native";
import {
	Control,
	Controller,
	FieldValues,
	RegisterOptions,
} from "react-hook-form";
import React from "react";
import AntDesign from "@expo/vector-icons/AntDesign";

interface CustomInputProps {
	control: Control<FieldValues>;
	name: string;
	rules?: RegisterOptions;
	placeholder: string;
	secureTextEntry: boolean;
}

const CustomInput = ({
	name,
	control,
	rules = {},
	placeholder,
	secureTextEntry,
}: CustomInputProps) => {
	const iconMap: Record<string, { library: any; name: string }> = {
		email: { library: AntDesign, name: "mail" },
		password: { library: AntDesign, name: "key" },
		username: { library: AntDesign, name: "user" },
	};

	const IconComponent = iconMap[name]?.library || AntDesign;
	const iconName = iconMap[name]?.name || "questioncircleo";
	return (
		<Controller
			name={name}
			control={control}
			rules={rules}
			render={({
				field: { onChange, onBlur, value },
				fieldState: { error },
			}) => (
				<>
					<View
						style={[
							styles.inputContainer,
							error ? styles.borderFalse : styles.borderTrue,
						]}
					>
						<IconComponent
							name={iconName}
							size={20}
							color={error?.message ? "red" : "rgb(17 71 164)"}
						/>
						<TextInput
							placeholder={placeholder}
							onBlur={onBlur}
							onChangeText={onChange}
							value={value}
							secureTextEntry={secureTextEntry}
							allowFontScaling={true}
							style={styles.input}
							underlineColorAndroid="transparent"
						/>
					</View>

					{error && (
						<Text
							style={{ color: "red", alignSelf: "stretch", marginBottom: 10 }}
						>
							{error.message || "Error"}
						</Text>
					)}
				</>
			)}
		/>
	);
};

const styles = StyleSheet.create({
	inputContainer: {
		flexGrow: 0,
		flexShrink: 1,
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#f6f8fc",
		marginBottom: 10,
		borderWidth: 1,
		borderRadius: 15,
		borderColor: "#f6f8fc",
		maxWidth: "auto",
		padding: 6,
	},
	input: {
		flex: 1,
		backgroundColor: "#f6f8fc",
		color: "#424242",
		fontSize: 18,
	},
	borderTrue: {
		borderColor: "rgb(17 71 164)",
	},
	borderFalse: {
		borderColor: "red",
	},
});

export default CustomInput;
