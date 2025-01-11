# Student Scheduler

## Running the application
```bash
./docker-compose.sh run ENV
```
To

Replace `ENV` with the name of the environment you want to use. Uses the settings in the .env.dev file and the `docker-compose.yml` configuration. The available environments are:
- `dev`: For development.
- `prod`: For production.

For example, to start the application in the development environment, you would run:
```bash
./docker-compose.sh run dev
```

To use the app, first log in to USOS student account under
`
localhost:8080/api/v1/login
`


## Testing the application
```bash
./docker-compose.sh run test
```
This command will start the application in the testing environment, which uses the settings in the .env.test file and the `docker-compose.test.yml` configuration.
After the tests are complete, test database is flushed. Both containers are removed.

## Debugging the backend
```bash
./docker-compose.sh debug 
```
This command will start the docker compose database service (db) needed for debugging backend.

## Building the application
```bash
./docker-compose.sh build ENV
```
Replace `ENV` with the name of the environment you want to use. The available environments are `dev`, `test` and `prod`.

For example, to build the application in the development environment, you would run:
```bash
./docker-compose.sh build dev
```

## Stop and remove backend containers
```bash
./docker-compose.sh down ENV
```
Replace `ENV` with the name of the environment you want to stop and remove. The available environments are `dev` and `prod`.

For example, to stop and remove the application in the development environment, you would run:
```bash
./docker-compose.sh down dev
```

## Flush dev database
```bash
./docker-compose.sh flush dev
```
This command will remove all data from the dev database. Please note that this command is only applicable for the dev environment.

## Clean up Docker
```bash
./docker-compose.sh clean
```
This command will remove all unused containers, networks, and dangling images.
```
