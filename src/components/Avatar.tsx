import { LinearGradient } from "expo-linear-gradient";
import { ImageBackground, StyleSheet, Image } from "react-native";

const Avatar = () => {
	const frame = "../../assets/images/frame.png";
	const avatar = "../../assets/images/avatar.png";
	return (
		<LinearGradient
			// Background Linear Gradient
			colors={["#D6FFDB00", "#D6FFDB", "#66FF00"]}
			start={{ x: 0, y: 0 }}
			end={{ x: 0, y: 1 }}
			style={styles.gradientBox}
		>
			<ImageBackground
				resizeMode="cover"
				source={require(frame)}
				style={styles.frame}
			>
				<Image
					source={require(avatar)}
					width={119}
					height={119}
					style={styles.avatar}
				/>
			</ImageBackground>
		</LinearGradient>
	);
};

const styles = StyleSheet.create({
	frame: {
		flex: 0,
		justifyContent: "center",
		width: 119,
		height: 119,
		maxWidth: 100,
	},
	avatar: {
		marginLeft: 9,
		marginBottom: 5,
		borderRadius: 5,
	},
	gradientBox: {
		width: 115,
		height: 115,
		borderRadius: 16,
		shadowColor: "#66FF00",
		shadowOffset: { width: 10, height: 10 },
		shadowOpacity: 1,
		shadowRadius: 15,
		elevation: 10, // For Android shadow
	},
});
export default Avatar;
