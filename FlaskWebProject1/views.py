"""
Routes and views for the flask application.
"""

from FlaskWebProject1 import app

@app.route('/')
def main():
    """Returns 400"""
    return "You should not see this", 403

@app.route('/testDB')
def test_DB():
    try:
        import os, re
        import pyodbc
        return os.environ["MYSQLCONNSTR_localdb"]
    except Exception as e:
        return e.message(), 400
#    server = 'yourserver.database.windows.net'
#    database = 'yourdatabase'
#    username = 'yourusername'
#    password = 'yourpassword'
#    driver= '{ODBC Driver 13 for SQL Server}'
#    cnxn = pyodbc.connect('DRIVER='+driver+';PORT=1433;SERVER='+server+';PORT=1443;DATABASE='+database+';UID='+username+';PWD='+ password)
#    cursor = cnxn.cursor()
#    cursor.execute("select @@VERSION")
#    row = cursor.fetchone()
#    if row:
#        print row

