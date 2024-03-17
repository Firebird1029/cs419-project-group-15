"""Supabase code for Flask app. From https://supabase.com/blog/oauth2-login-python-flask-apps"""

from gotrue import SyncSupportedStorage
from flask import session


class FlaskSessionStorage(SyncSupportedStorage):
    """Supabase code for Flask app. From https://supabase.com/blog/oauth2-login-python-flask-apps"""

    def __init__(self):
        self.storage = session

    def get_item(self, key: str):
        if key in self.storage:
            return self.storage[key]
        return None

    def set_item(self, key: str, value: str) -> None:
        self.storage[key] = value

    def remove_item(self, key: str) -> None:
        if key in self.storage:
            self.storage.pop(key, None)
