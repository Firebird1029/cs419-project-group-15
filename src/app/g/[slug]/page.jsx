"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Center,
  Container,
  Heading,
  Input,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { getGame } from "@/services/apiService";

function Riddle({ question, answer }) {
  const [guess, setGuess] = useState("");
  const [result, setResult] = useState("");

  function checkAnswer() {
    if (guess.toLowerCase() === answer.toLowerCase()) {
      setResult("Correct!");
    } else {
      setResult("Incorrect!");
    }
  }

  return (
    <Container pt={24}>
      <VStack>
        <Center>
          <Heading size="md" mb={12}>
            {question}
          </Heading>
        </Center>
        <Stack width="20rem" mb={12}>
          <Input
            type="text"
            placeholder="Answer"
            mb={4}
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && checkAnswer()}
          />
          <Button colorScheme="blue" onClick={() => checkAnswer()}>
            Guess
          </Button>
        </Stack>
        <Stack>
          <Text color={result === "Correct!" ? "green" : "red"}>
            <strong>{result}</strong>
          </Text>
        </Stack>
      </VStack>
    </Container>
  );
}

function SelectGameType({ type, game }) {
  switch (type) {
    case "riddle":
      return <Riddle question={game.question} answer={game.answer} />;
    case "":
    default:
      return <Container>Something went wrong!</Container>;
  }
}

export default function GamePage({ params: { slug } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [game, setGame] = useState(null);

  useEffect(() => {
    getGame(slug)
      .then((res) => {
        if (res.success) {
          if (res.count > 0) {
            setGame(res.data[0]); // return game that matches url tag
          }
        } else {
          // TODO display error message in GUI
          console.error(res);
        }
        setLoading(false);
      })
      .catch((e) => {
        console.error(e); // TODO
        router.push("/error");
      });
  }, []);

  return (
    <Container>
      <Heading mt={4} mb={8}>
        {game && game.name}
      </Heading>
      {/* eslint-disable-next-line no-nested-ternary */}
      {loading
        ? "Loading..."
        : game
          ? SelectGameType({
              type: game.type,
              game: JSON.parse(game.details),
            })
          : "Game not found!"}
    </Container>
  );
}
