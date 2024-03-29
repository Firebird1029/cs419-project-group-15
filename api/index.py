"""Server code for the backend API."""

# don't lint TODOs
# pylint: disable=fixme

from flask import Flask, request
from gotrue.errors import AuthApiError
from flask_restful import Resource, Api, abort
from postgrest.exceptions import APIError

from db import supabase

# Setup Flask app and API
app = Flask(__name__)
app.secret_key = "super secret key"  # TODO change key, move to separate file
app.config["SESSION_TYPE"] = "filesystem"  # TODO change to something else in future
api = Api(app)


class Ping(Resource):
    """API route to check if the server is running."""

    def get(self):
        """Return pong for a successful ping."""
        return "pong"


api.add_resource(Ping, "/api/ping")


def check_auth(req, user_id):
    """Check if the user is authorized to perform the action."""
    session = req["session"]["data"]["session"]
    access_token = session["access_token"]
    refresh_token = session["refresh_token"]

    try:
        # set auth session
        supabase.auth.set_session(access_token, refresh_token)

        # confirm that the session user matches the SQL row user
        res = supabase.auth.get_user(access_token)
        user = res.user
        if user.id != user_id:
            abort(403, message="You are not authorized to perform this action.")
    except AuthApiError as e:
        abort(403, message=e.message)


class NewGame(Resource):
    """New Game"""

    def post(self):
        """Create a new game."""
        req = request.get_json()
        check_auth(req, req["user_id"])

        try:
            name, game_type, details = req["name"], req["type"], req["details"]

            # insert row into games table in Supabase
            res = (
                supabase.table("games")
                .insert(
                    {
                        "owner": req["user_id"],
                        "name": name,
                        "type": game_type,
                        "details": details,
                    }
                )
                .execute()
            )

            return {"success": True, "data": res.data}
        except APIError as e:
            return {
                "success": False,
                "message": e.message,
            }, 500


api.add_resource(NewGame, "/api/g/create")


class Game(Resource):
    """Existing Game"""

    def get(self, url_tag):
        """Get a game by its URL tag."""
        try:
            res = supabase.table("games").select("*").eq("url_tag", url_tag).execute()
            return {"success": True, "data": res.data, "count": len(res.data)}
        except APIError as e:
            return {"success": False, "message": e.message, "count": 0}, 500


api.add_resource(Game, "/api/g/<string:url_tag>")
