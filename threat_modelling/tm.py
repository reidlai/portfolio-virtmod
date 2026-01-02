from pytm import TM, Server, Datastore, Dataflow, Actor

tm = TM("Portfolio App")
tm.description = "Portfolio virtual module threat model"

user = Actor("User")
web = Server("Web Server")
api = Server("API Server")
db = Datastore("Database")

Dataflow(user, web, "HTTPS Request")
Dataflow(web, api, "API Call")
Dataflow(api, db, "Query")

if __name__ == "__main__":
    tm.process()
