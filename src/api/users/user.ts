import { supabase } from "@/lib/supabase";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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

export function useProfile(id: string) {
	return useQuery({
		queryKey: ["profiles", id],
		queryFn: async () => {
			const { data, error } = await supabase
				.from("profiles")
				.select("*")
				.eq("id", id)
				.single();
			if (error) {
				throw new Error(error?.message);
			}
			return data;
		},
		enabled: !!id,
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

export async function updateUsername(updates: { username?: string }) {
	const {
		data: { user },
		error: authError,
	} = await supabase.auth.getUser();

	if (authError || !user) throw new Error("User not logged in");

	const { error } = await supabase
		.from("profiles")
		.update(updates)
		.eq("id", user.id);

	if (error) throw new Error(error.message);

	console.log("Profile updated successfully");
}

export async function sendMessage(
	senderId: string,
	receiverId: string,
	message: string
) {
	const { error } = await supabase.from("messages").insert([
		{
			sender_id: senderId,
			receiver_id: receiverId,
			message,
		},
	]);

	if (error) throw new Error(error.message);
}

export function useInsertMessage() {
	return useMutation({
		mutationFn: async ({
			sender_id,
			receiver_id,
			message,
		}: {
			sender_id: string;
			receiver_id: string;
			message: string;
		}) => {
			const { data: newMessage, error } = await supabase
				.from("messages")
				.insert({
					sender_id,
					receiver_id,
					message,
				})
				.single();

			if (error) {
				throw new Error(error.message);
			}

			return newMessage;
		},
	});
}
