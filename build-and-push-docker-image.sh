#!/bin/bash
# Build and push a docker image.
# Requires that this project's git remote supports Docker container registry.
# Execute in the directory containing the Dockerfile.

DOCKER_URL=gitlab.ilabt.imec.be:4567
T1=$(git config --get remote.origin.url)
T2=${T1##*:} # delete everything up to and including last ':'
T3=${T2%.git} # delete trailing '.git'
PATH_TO_PROJECT=${T3,,} # make lowercase for docker commands!
echo $T1
echo $T2
echo $T3
echo $PATH_TO_PROJECT

echo "Enter credentials for ${DOCKER_URL} (with password or in case of 2FA: with a personal access token)"
docker login ${DOCKER_URL}
docker build -t ${DOCKER_URL}/${PATH_TO_PROJECT} .
docker push ${DOCKER_URL}/${PATH_TO_PROJECT}
docker logout ${DOCKER_URL}
