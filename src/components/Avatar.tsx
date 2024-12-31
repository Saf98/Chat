import { LinearGradient } from "expo-linear-gradient";
import { ImageBackground, StyleSheet, Image } from "react-native";

const Avatar = ({
	frameSize,
	avatarSize,
	marginLeft,
	marginBottom,
	radius,
	status,
}: any) => {
	const frame = "../../assets/images/frame.png";
	// 119
	const avatar = "../../assets/images/avatar.png";
	// 96
	return (
		<LinearGradient
			// Background Linear Gradient
			// colors={["#D6FFDB00", "#D6FFDB", "#66FF00"]} online
			// #FF9A0000 0%, #D8820055 30%,  #fca30d 100%); offline

			colors={
				status
					? ["#D6FFDB00", "#D6FFDB", "#66FF00"]
					: ["#FF9A0000", "#D8820055", "#FCA30D"]
			}
			start={{ x: 2, y: 0 }}
			end={{ x: 0, y: 1 }}
			style={[styles.gradientBox, { width: frameSize, height: frameSize }]}
		>
			<ImageBackground
				resizeMode="cover"
				source={require(frame)}
				style={[styles.frame, { width: frameSize, height: frameSize }]}
			>
				<Image
					source={require(avatar)}
					style={[
						{
							width: avatarSize,
							height: avatarSize,
							marginLeft: marginLeft,
							marginBottom: marginBottom,
							borderRadius: radius,
						},
					]}
				/>
			</ImageBackground>
		</LinearGradient>
	);
};

const styles = StyleSheet.create({
	frame: {
		flex: 0,
		justifyContent: "center",
	},
	gradientBox: {
		borderRadius: 16,
		shadowColor: "#66FF00",
		shadowOffset: { width: 10, height: 10 },
		shadowOpacity: 1,
		shadowRadius: 16,
		elevation: 10, // For Android shadow
	},
});
export default Avatar;
