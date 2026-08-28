SOTA Backend Server

This is the backend server for a SOTA (Software Over The Air) update system.

The main purpose of this server is to keep track of software builds and provide update information to devices or applications. For example, an Android application can connect to this server and check whether a newer build is available.

Instead of keeping update information inside the application itself, the application can simply ask the server for the latest available build.

How it works

The basic idea is simple:

1. A new software build is created.
2. The build information is added to the SOTA server.
3. The Android app or other client checks the server for updates.
4. The client gets the available version and build information.
5. It compares the server version with the version currently installed.
6. If a newer version is available, the client can notify the user and provide the update.
7. The changelog can also be shown to the user so they know what has changed.

For example, if the device currently has:

Version: 5.23000

and the server contains:

Version: 5.24000

the client can determine that a newer build is available.

The server does not install the update itself. It mainly provides the information required by the client to decide whether an update is available and where it can be downloaded from.

What information is stored?

Every software update contains information such as:

* Name – Name of the software
* Version – Software/build version
* Type – For example, stable or beta
* Build Date – When the build was created
* Changelog – What was changed or fixed
* URL – Location from where the update can be downloaded

This information is stored in a MySQL database.

API

The server currently provides a few simple API endpoints.

Check server

GET /

Used to check whether the API is running.

Response:

Api is running

Get available updates

GET /getallupdates

Returns the update information stored in the database.

A client can use this endpoint to retrieve the available builds and compare them with its own version.

Add a new update

POST /addupdate/

Example:

{
  "name": "ksecure",
  "version": "5.23400",
  "type": "stable",
  "builddate": "2026-09-27 19:00:00",
  "changelog": "1) Added security fixes",
  "url": "https://example.com/ksecure"
}

This adds a new software build to the SOTA database.

Delete an update

DELETE /deleteupdate/:id

For example:

DELETE /deleteupdate/3

This removes the update with the specified ID.

Database

The backend uses MySQL to store the update information.

The updates table contains:

Field	Purpose
id	Unique ID for the update
name	Software name
version	Build/version number
type	Release type such as beta or stable
builddate	Build creation date
changelog	Changes made in the build
url	Download URL

The server automatically creates the updates table when it starts if the table does not already exist.

Configuration

Database credentials are kept in a .env file instead of being directly written into the source code.

Example:

db_host=your-database-host
db_user=your-database-user
db_port=3306
db_password=your-database-password
db_database=your-database-name

The MySQL connection also uses a CA certificate for SSL verification.

The CA certificate is loaded using Node.js fs:

fs.readFileSync("../ca.pem")

Running the server

Install the required packages:

npm install

Start the server:

node server.js

The server will run on:

http://localhost:5000

SOTA flow

The complete idea behind this backend can be thought of like this:

          New Software Build
                  |
                  v
          Add build information
                  |
                  v
             SOTA Server
                  |
                  v
              MySQL DB
                  |
                  |
        Android / Client checks
                  |
                  v
          Get latest version
                  |
                  v
       Compare with installed build
             /          \
            /            \
       Same version    New version
           |                |
           v                v
       Do nothing       Show update
                            |
                            v
                     Download update

Why this backend exists

The goal is to keep the update system simple.

The Android application does not need to know beforehand which build is the latest one. It can ask the SOTA server whenever it wants to check for an update.

This also makes it easier to manage different releases such as:

5.23000  → stable
5.24000  → stable
5.25000  → beta

The server can contain multiple builds, while the client decides which one is relevant based on its own version and the update information returned by the API.

Built with

* Node.js
* Express.js
* MySQL
* mysql2
* dotenv

This project is intended to be a simple backend foundation for SOTA update checking and software build management.