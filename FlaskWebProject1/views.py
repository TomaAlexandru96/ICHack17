"""
Routes and views for the flask application.
"""

from FlaskWebProject1 import app

@app.route('/')
def main():
    """Returns 400"""
    return "You should not see this", 403
