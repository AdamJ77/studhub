#!/bin/sh

command=$1
env=$2

if [ "$command" = "clean" ]; then
    echo "In clean mode."
    docker container prune -f
    docker rmi $(docker images --filter "dangling=true" -q --no-trunc)
    exit 0
fi

if [ "$command" = "debug" ]; then
    echo "In debug mode."
    env="dev"
fi

if [ -z "$env" ]; then
    echo "No environment provided. Please provide a valid environment (dev, prod, test)."
    echo "Usage: ./docker-compose.sh [command] [env]"
    exit 1
fi

if [ "$env" != "dev" ] && [ "$env" != "test" ] && [ "$env" != "prod" ]; then
    echo "Invalid environment provided. Must be 'dev', 'test', or 'prod'."
    exit 1
fi

if [ ! -f "./.env.$env" ]; then
    echo "The config file .env.$env does not exist."
    exit 1
fi

if [ "$env" = "test" ]; then
    docker_file="./docker/docker-compose-test.yml"
else
    docker_file="./docker/docker-compose.yml"
fi

docker_command="docker compose --env-file ./.env.$env -f $docker_file"

if [ "$command" = "down" ]; then
    echo "Running docker-compose down -v"
    $docker_command down -v
elif [ "$command" = "run" ]; then
    if [ "$env" = "test" ]; then
        echo "STARTING TEST ENVIRONMENT"
        $docker_command run --rm --service-ports backend
        $docker_command down -v
    elif [ "$env" = "debug" ]; then
        echo "Running the database for debugging"
        $docker_command run --rm --service-ports db redis
    else
        echo "STARTING DEV ENVIRONMENT"
        $docker_command up 
    fi
elif [ "$command" = "build" ]; then
    if [ "$env" = "test" ]; then
        echo "Building the test docker image"
        $docker_command build backend
    else
        echo "Building the docker images for $env environment."
        $docker_command build
    fi
elif [ "$command" = "flush"  ]; then
    if [ "$env" = "dev" ]; then
        echo "Flushing the dev database"
        docker rm db
        docker volume rm student-scheduler_dbdata
    else
        echo "Flush command is only applicable for dev environment."
    fi
elif [ "$command" = "debug" ]; then
    echo "Running the database for backend debugging"
    $docker_command up db redis frontend
else
    echo "Invalid command. Please provide a valid command (run, build, down, clean)."
    echo "Usage: ./docker-compose.sh [command] [env]"
    exit 1
fi
