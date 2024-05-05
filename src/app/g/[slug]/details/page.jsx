"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Container,
  Heading,
  Input,
  Table,
  Textarea,
} from "@chakra-ui/react";
import createClient from "@/utils/supabase/client";
import {
  createRating,
  getGame,
  getRatings,
  getScoreboard,
} from "@/services/apiService";

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
            <th>Elapsed time</th>
          </tr>
        </thead>
        <tbody>
          {scores
            .sort() // TODO sort by score
            .map((score, index) => (
              <tr key={score.id}>
                <td>{index + 1}</td>
                <td>{score.profiles.username}</td>
                <td>{score.details ? score.details : ""}</td>
              </tr>
            ))}
        </tbody>
      </Table>
    </Container>
  );
}

function Ratings({ ratings }) {
  return (
    <Container>
      <Heading as="h2" size="md" mb={4}>
        Ratings
      </Heading>
      <Table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Rating</th>
            <th>Comment</th>
          </tr>
        </thead>
        <tbody>
          {ratings
            .sort() // TODO sort by rating
            .map((rating) => (
              <tr key={rating.id}>
                <td>{rating.profiles.username}</td>
                <td>{rating.rating}</td>
                <td>{rating.comment}</td>
              </tr>
            ))}
        </tbody>
      </Table>
    </Container>
  );
}

// Component to create a new rating
function CreateRating({
  user,
  callCreateRating,
  rating,
  setRating,
  comment,
  setComment,
  ratingCreated,
}) {
  if (!user) {
    return (
      <Box>
        <Link href="/login">
          <Button variant="link">Log in</Button>
        </Link>{" "}
        to rate this game.
      </Box>
    );
  }

  if (ratingCreated) {
    return <Box>Rating created successfully!</Box>;
  }

  return (
    <Box>
      <Heading as="h2" size="md" mb={4}>
        Rate This Game
      </Heading>
      {/* Textbox */}
      <Textarea
        placeholder="Write your review here"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      {/* Rating */}
      <Input
        mt={4}
        placeholder="Rating"
        type="number"
        value={rating}
        onChange={(e) => setRating(e.target.value)}
      />
      {/* Submit button */}
      <Button mt={4} type="submit" value="Submit" onClick={callCreateRating}>
        Create
      </Button>
    </Box>
  );
}

export default function GameDetailsPage({ params: { slug } }) {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [game, setGame] = useState(null);
  const [scores, setScores] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [user, setUser] = useState(null);

  const [rating, setRating] = useState("");
  const [comment, setComment] = useState("");
  const [ratingCreated, setRatingCreated] = useState(false);

  // console.log("GJKLJAKDLSJGK")
  const callCreateRating = useCallback(() => {
    createRating(slug, game.id, rating, comment).then((res) => {
      if (res.success) {
        // redirect user to newly-created game
        setRatingCreated(true);

        // get game's ratings
        getRatings(slug)
          .then((ratingsRes) => {
            if (ratingsRes.success) {
              setRatings(ratingsRes.data); // set game scores, even if empty
            } else {
              // getScoreboard API call failed
              // TODO display error message in GUI
              console.error(ratingsRes);
            }
          })
          .catch((e) => {
            console.error(e); // TODO display error message in GUI
            router.push("/error");
          });
      } else {
        console.error(res.message); // TODO show in GUI
      }
    });
  }, [game, rating, comment]);

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

            // get game's ratings via different API call
            getRatings(slug)
              .then((ratingsRes) => {
                if (ratingsRes.success) {
                  setRatings(ratingsRes.data); // set game scores, even if empty
                } else {
                  // getScoreboard API call failed
                  // TODO display error message in GUI
                  console.error(ratingsRes);
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

  // do not display component to create rating if not logged in
  useEffect(() => {
    (async () => {
      const {
        data: { user: _user },
      } = await supabase.auth.getUser();

      setUser(_user);
    })().catch((err) => {
      console.error(err); // TODO display error message to user
    });
  }, []);

  // do not display component to create rating if user already rated game
  useEffect(() => {
    if (!user) {
      return;
    }
    if (!ratings) {
      return;
    }
    ratings.forEach((_rating) => {
      console.log(_rating);
      if (_rating.profiles.id === user.id) {
        setRatingCreated(true);
      }
    });
  }, [user, ratings]);

  return (
    <Container>
      <Heading mt={4} mb={8}>
        {game && game.name}
      </Heading>

      <Box>
        <Button colorScheme="blue" onClick={() => router.push(`/g/${slug}`)}>
          Play Game
        </Button>
      </Box>
      {
        // eslint-disable-next-line no-nested-ternary
        loading ? (
          "Loading..." // before API call finishes, display loading message
        ) : game ? (
          // if game found, render details
          <>
            <Box mt={12}>
              {
                // Scoreboard
                scores &&
                  Scoreboard({
                    scores,
                  })
              }
            </Box>

            <Box mt={12}>
              {
                // Ratings
                Ratings({ ratings })
              }
            </Box>
          </>
        ) : (
          "Game not found!"
        ) // if game not found, display error message
      }

      {
        // Create Rating
      }
      <>
        <Box mt={12} />
        {CreateRating({
          user,
          callCreateRating,
          rating,
          setRating,
          comment,
          setComment,
          ratingCreated,
        })}
      </>
    </Container>
  );
}
