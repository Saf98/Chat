import { supabase } from "@/lib/supabase";
import { View, Text, Button } from "react-native";
import { useLoggedInUserProfile, useProfiles } from "@/api/users/user";

const ProfileScreen = () => {
	const { data } = useProfiles();
	const { data: profile, isLoading, error } = useLoggedInUserProfile();

	console.log(profile);

	return (
		<View>
			<Text>Fetch User Profile</Text>

			<Button
				title="Sign out"
				onPress={async () => await supabase.auth.signOut()}
			/>
		</View>
	);
};

export default ProfileScreen;
