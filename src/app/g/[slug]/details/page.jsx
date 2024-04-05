"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Container, Heading, Table } from "@chakra-ui/react";
import { getGame, getScoreboard } from "@/services/apiService";

// Scoreboard React component
function Scoreboard({ scores }) {
  // TODO sorting by some metric (e.g. score) before displaying
  // TODO style table
  return (
    <Container>
      <Heading as="h2" size="md" mb={4}>
        Scoreboard
      </Heading>
      <Table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Name</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {scores
            .sort() // TODO sort by score
            .map((score, index) => (
              <tr key={score.id}>
                <td>{index + 1}</td>
                <td>{score.profiles.username}</td>
                <td>{score.details ? score.details.score : ""}</td>
              </tr>
            ))}
        </tbody>
      </Table>
    </Container>
  );
}

export default function GameDetailsPage({ params: { slug } }) {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [game, setGame] = useState(null);
  const [scores, setScores] = useState([]);

  // on page load, call API to get game details from slug (game's url tag)
  useEffect(() => {
    getGame(slug)
      .then((res) => {
        if (res.success) {
          if (res.count > 0) {
            setGame(res.data[0]); // set game that matches url tag, if found in DB

            // get game's scoreboard via different API call
            // TODO theoretically can run in parallel with getGame
            getScoreboard(slug)
              .then((scoreboardRes) => {
                if (scoreboardRes.success) {
                  setScores(scoreboardRes.data); // set game scores, even if empty
                } else {
                  // getScoreboard API call failed
                  // TODO display error message in GUI
                  console.error(scoreboardRes);
                }
              })
              .catch((e) => {
                console.error(e); // TODO display error message in GUI
                router.push("/error");
              });
          }
        } else {
          // getGame API call failed
          // TODO display error message in GUI
          console.error(res);
        }

        setLoading(false);
      })
      .catch((e) => {
        console.error(e); // TODO display error message in GUI
        router.push("/error");
      });
  }, []);

  return (
    <Container>
      <Heading mt={4} mb={8}>
        {game && game.name}
      </Heading>

      {
        // eslint-disable-next-line no-nested-ternary
        loading
          ? "Loading..." // before API call finishes, display loading message
          : scores
            ? // if scores found, render scoreboard component
              Scoreboard({
                scores,
              })
            : "Game not found!" // if game not found, display error message
      }
    </Container>
  );
}
