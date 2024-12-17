import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";

export function useProfiles() {
	return useQuery({
		queryKey: ["profiles"],
		queryFn: async () => {
			const { data, error } = await supabase.from("profiles").select("*");

			if (error) {
				throw new Error(error?.message);
			}

			return data;
		},
	});
}

export async function loggedInUserProfile() {
	const {
		data: { user },
		error: authError,
	} = await supabase.auth.getUser();

	if (authError || !user) throw new Error("User not logged in");

	const { data, error } = await supabase
		.from("profiles")
		.select("*")
		.eq("id", user.id)
		.single();

	if (error) throw new Error(error.message);

	return data;
}

export function useLoggedInUserProfile() {
	return useQuery({
		queryKey: ["loggedInUserProfile"],
		queryFn: loggedInUserProfile,
	});
}
