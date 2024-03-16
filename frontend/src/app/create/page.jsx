"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Container,
  Heading,
  Input,
  Select,
  Stack,
} from "@chakra-ui/react";
import { createGame } from "@/services/apiService";
import createClient from "@/utils/supabase/client";

function SelectGameQuestions({ type, setGameDetails, setGameDetailsReady }) {
  const [userQuestion, setUserQuestion] = useState("");
  const [userAnswer, setUserAnswer] = useState("");

  useEffect(() => {
    setGameDetails({ question: userQuestion, answer: userAnswer });
    setGameDetailsReady(userQuestion && userAnswer);
  }, [userQuestion, userAnswer]);

  switch (type) {
    case "riddle":
      return (
        <div>
          <Stack spacing={4} pt={12}>
            <p>Question:</p>
            <Input
              placeholder=""
              value={userQuestion}
              onChange={(e) => setUserQuestion(e.target.value)}
            />

            <p>Answer:</p>
            <Input
              placeholder=""
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
            />
          </Stack>
        </div>
      );
    case "":
      return "";
    default:
      return <Container>Something went wrong!</Container>;
  }
}

export default function CreateNewGamePage() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [gameName, setGameName] = useState("");
  const [gameType, setGameType] = useState("");
  const [gameDetails, setGameDetails] = useState({});
  const [gameDetailsReady, setGameDetailsReady] = useState(false);

  // Ensure user is logged in
  useEffect(() => {
    supabase.auth.getUser().then(({ user, error }) => {
      if (error || !user) {
        router.push("/login");
      } else {
        setLoading(false);
      }
    });
  }, []);

  return (
    !loading && (
      <Container>
        <Heading mt={4} mb={8}>
          Create New Game
        </Heading>

        <Stack spacing={4} pt={12}>
          <p>Game Name:</p>
          <Input
            placeholder=""
            value={gameName}
            onChange={(e) => setGameName(e.target.value)}
          />

          <p>Game Type:</p>
          <Select
            placeholder="Select game type"
            value={gameType}
            onChange={(e) => setGameType(e.target.value)}
          >
            <option value="riddle">Riddle</option>
            {/* TODO below */}
            <option value="option2">Option 2</option>
            <option value="option3">Option 3</option>
          </Select>

          <Container py={4}>
            <SelectGameQuestions
              type={gameType}
              setGameDetails={setGameDetails}
              setGameDetailsReady={setGameDetailsReady}
            />
          </Container>

          <Button
            colorScheme="green"
            mt={8}
            isDisabled={!gameName || !gameType || !gameDetailsReady}
            onClick={async () => {
              const res = await createGame({
                name: gameName,
                type: gameType,
                details: JSON.stringify(gameDetails),
              });
              if (res.success) {
                // redirect user to newly-created game
                router.push(`/g/${res.data[0].url_tag}`);
              } else {
                console.error(res.message); // TODO show in GUI
              }
            }}
          >
            Create
          </Button>
        </Stack>
      </Container>
    )
  );
}
