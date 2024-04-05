"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Container, Heading, Table } from "@chakra-ui/react";
import { getScoreboard } from "@/services/apiService";

// Scoreboard GUI component
function ScoreboardDisplay({ scores }) {
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

export default function GameScoreboardPage({ params: { slug } }) {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [scores, setScores] = useState([]);

  // on page load, call API to get game's scoreboard from slug (game's url tag)
  useEffect(() => {
    getScoreboard(slug)
      .then((res) => {
        if (res.success) {
          if (res.count > 0) {
            setScores(res.data); // return game scores from game that matches url tag, if found in DB
          } else {
            // TODO either game url tag is wrong (game doesn't exist) or scoreboard is empty
          }
        } else {
          // API call failed
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
        {scores && scores.name}
      </Heading>

      {
        // eslint-disable-next-line no-nested-ternary
        loading
          ? "Loading..." // before API call finishes, display loading message
          : scores
            ? // if scores found, render scoreboard component
              ScoreboardDisplay({
                scores,
              })
            : "Game not found or scoreboard empty!" // if scores not found, display error message
      }
    </Container>
  );
}
