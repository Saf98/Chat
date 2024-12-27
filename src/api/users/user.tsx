import { supabase } from "@/lib/supabase";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

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

	console.log("Username updated successfully");
}

export async function updateStatus(updates: { status?: string }) {
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

	console.log("Status updated successfully");
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

const fetchMessages = async ({
	sender_id,
	receiver_id,
}: {
	sender_id: string;
	receiver_id: string;
}) => {
	const { data, error } = await supabase
		.from("messages")
		.select("id, sender_id, receiver_id, message, created_at")
		.or(
			`and(sender_id.eq.${sender_id},receiver_id.eq.${receiver_id}),and(sender_id.eq.${receiver_id},receiver_id.eq.${sender_id})`
		)
		.order("created_at", { ascending: true });

	if (error) {
		console.error("Error fetching messages:", error.message);
		throw error;
	}

	return data;
};

export function useReadMessage(sender_id: string, receiver_id: string) {
	return useQuery({
		queryKey: ["messages", sender_id, receiver_id],
		queryFn: () => fetchMessages({ sender_id, receiver_id }),
		enabled: !!sender_id && !!receiver_id, // Only fetch if both IDs are available
		staleTime: 0, // Optional: Cache data for 1 minute
	});
}
