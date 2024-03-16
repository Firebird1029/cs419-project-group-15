"""Main code to start the API server."""

# don't lint TODOs
# pylint: disable=fixme

from server import app

if __name__ == "__main__":
    app.secret_key = "super secret key"  # TODO change key, move to separate file
    app.config["SESSION_TYPE"] = "filesystem"  # TODO change to something else in future
    app.run()
