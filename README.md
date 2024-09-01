1. Generated Docker Files:

Initialized Docker in the project directory, which generated a Dockerfile and docker-compose.yml file.


2. Modified docker-compose.yml:

Added the MongoDB service configuration.
Updated the server service to depend on the MongoDB service and ensured the app uses the environment variables from the .env file.


3. Modified index.ts:

Changed the server's host address to 0.0.0.0 to allow external connections from Docker.


4. Built and started the Docker containers:

docker-compose up --build

checked that the api works as expected on http://localhost:3000 in a browser.
