import { View, Text } from "@/components/Themed";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

const ContactsScreen = () => {
	const [users, setUsers] = useState(null);

	// useEffect(() => {
	// 	const fetchUsers = async () => {
	// 		const { data, error } = await supabase
	// 			.from("users")
	// 			.select("id, name, email");

	// 		if (!error) {
	// 			setUsers(data);
	// 		}

	// 		console.log(data, error);
	// 	};

	// 	fetchUsers();
	// }, []);

	return <View>{!users && <Text>You have no friends</Text>}</View>;
};

export default ContactsScreen;
