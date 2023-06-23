import React, { useEffect, useState, useRef } from "react";
import {
	Box,
	Container,
	VStack,
	Button,
	HStack,
	Center,
} from "@chakra-ui/react";
import Chitchat from "./components/Chitchat";
import Message from "./components/message";
import {
	onAuthStateChanged,
	getAuth,
	GoogleAuthProvider,
	signInWithPopup,
	signOut,
} from "firebase/auth";
import { app } from "./Firebase";
import {
	getFirestore,
	addDoc,
	collection,
	serverTimestamp,
	onSnapshot,
	query,
	orderBy,
} from "firebase/firestore";

const auth = getAuth(app);
const db = getFirestore(app);

const loginhandler = () => {
	const provider = new GoogleAuthProvider();
	signInWithPopup(auth, provider);
};

const logouthandler = () => {
	signOut(auth);
};

function App() {
	
	const [user, setuser] = useState(false);
	const [message, setmessage] = useState("");
	const [messages, setmessages] = useState([]);

	const divForScroll = useRef(null);

	useEffect(() => {
		const q = query(collection(db, "Messages"), orderBy("createdAt", "asc"));
		const unsubscribe = onAuthStateChanged(auth, (data) => {
			// console.log(data);
			setuser(data);
		});

		const unsbscribemessageform = onSnapshot(q, (snap) => {
			setmessages(
				snap.docs.map((item) => {
					const id = item.id;
					return { id, ...item.data() };
				})
			);
		});
		return () => {
			unsubscribe();
			unsbscribemessageform();
		};
	}, []);

	const submithandler = async (e) => {
		// console.log("submitted");
		e.preventDefault();
		try {
			await addDoc(collection(db, "Messages"), {
				text: message,
				uid: user.uid,
				uri: user.photoURL,
				createdAt: serverTimestamp(),
			});
			setmessage("");
			divForScroll.current.scrollIntoView({ behavior: "smooth" });
		} catch (error) {
			alert(error);
		}
	};

	return (
		<Box bg={"blue.100"}>
			<Container>
				<VStack
					h={"8vh"}
					bg={"white"}
					color={"Black"}
					fontFamily={"monospace"}
					fontSize={"4xl"}
					justifySelf={"center"}
					// alignItems={"Center"}
					// width={"109%"}
					padding={"1"}
					>
		
					<Chitchat />
				</VStack>
			</Container>

			{user ? (
				<Container h={"92vh"} bg={"white "}>
					<VStack h={"full"} padding={"1"}>
						<Button
							onClick={logouthandler}
							colorScheme={"red"}
							w={"full"}>
							log out
						</Button>
						<VStack
							h="full"
							w={"full"}
							overflowY="auto"
							css={{
								"&::-webkit-scrollbar": {
									display: "none",
								},
							}}>
							{messages.map((item) => (
								<Message
									key={item.id}
									text={item.text}
									uri={item.uri}
									user={
										item.uid === user.uid ? "me" : "other"
									}
								/>
							))}
							<div ref={divForScroll}></div>
						</VStack>
						<form
							onSubmit={submithandler}
							style={{ width: "100%" }}>
							<HStack>
								<input
									value={message}
									onChange={(e) => {
										setmessage(e.target.value);
									}}
									style={{ width: "100%", border: "none" }}
									placeholder="Enter a message"
								/>
								<Button type="submit" colorScheme={"purple"}>
									send
								</Button>
							</HStack>
						</form>
					</VStack>
				</Container>
			) : (
				<VStack bg={"white"} h="90vh" justifyContent={"center"}>
					<Button onClick={loginhandler} colorScheme="purple">
						Sign with google
					</Button>
				</VStack>
			)}
		</Box>
	);
}

export default App;
