"""Supabase code for Flask app. From https://supabase.com/blog/oauth2-login-python-flask-apps"""

import os
from dotenv import load_dotenv
from flask import g
from werkzeug.local import LocalProxy
from supabase.client import Client, ClientOptions
from flask_storage import FlaskSessionStorage


# load environment variables from .env file
load_dotenv()
url: str = os.getenv("SUPABASE_URL")
key: str = os.getenv("SUPABASE_KEY")


def get_supabase() -> Client:
    """Supabase code for Flask app. From https://supabase.com/blog/oauth2-login-python-flask-apps"""
    if "supabase" not in g:
        g.supabase = Client(
            url,
            key,
            options=ClientOptions(storage=FlaskSessionStorage(), flow_type="pkce"),
        )
    return g.supabase


supabase: Client = LocalProxy(get_supabase)
