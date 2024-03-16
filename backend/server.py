from flask import Flask, request, json
from db import supabase
from gotrue.errors import AuthApiError
from flask_restful import Resource, Api, abort
from postgrest.exceptions import APIError

app = Flask(__name__)
app.secret_key = "super secret key"  # TODO change key, move to separate file
app.config["SESSION_TYPE"] = "filesystem"  # TODO change to something else in future
api = Api(app)


class Ping(Resource):
    def get(self):
        return "pong"


api.add_resource(Ping, "/api/ping")


def check_auth(req, user_id):
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
        return e.message, 403


class NewGame(Resource):
    def post(self):
        req = request.get_json()
        check_auth(req, req["user_id"])
        name, gameType, details = req["name"], req["type"], req["details"]
        try:
            res = (
                supabase.table("games")
                .insert(
                    {
                        "owner": req["user_id"],
                        "name": name,
                        "type": gameType,
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
    def get(self, url_tag):
        try:
            res = supabase.table("games").select("*").eq("url_tag", url_tag).execute()
            return {"success": True, "data": res.data, "count": len(res.data)}
        except APIError as e:
            return {"success": False, "message": e.message, "count": 0}, 500


api.add_resource(Game, "/api/g/<string:url_tag>")
