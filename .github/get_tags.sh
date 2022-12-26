#!/bin/bash

# set -xe # Show output on the logs

version="$1" # Get version tag
DOCKER_IMAGE="$2"

regex='([0-9]+.[0-9]+.[0-9]+)(-([a-z]+).([0-9]+))?'

if [[ $version =~ $regex ]]; then
    v="${BASH_REMATCH[1]}"
    channel="${BASH_REMATCH[3]}"
    channel_version="${BASH_REMATCH[4]}"

    tag="${DOCKER_IMAGE}:${version#v}"

    regex='([0-9]+).([0-9]+).([0-9]+)'
    if [[ $v =~ $regex ]]; then
        major=${BASH_REMATCH[1]}
        minor=${BASH_REMATCH[2]}
        patch=${BASH_REMATCH[3]}

        arr_version=( "${major}" "${major}.${minor}" "${major}.${minor}.${patch}" )
        if [[ -n "${channel}" ]]; then
        tag="${tag},${DOCKER_IMAGE}:${channel}"
        for i in "${arr_version[@]}"; do
            tag="${tag},${DOCKER_IMAGE}:${i}-${channel}"
        done
        else
        tag="${DOCKER_IMAGE}:latest"
        for i in "${arr_version[@]}"; do
            tag="${tag},${DOCKER_IMAGE}:${i}"
        done
        echo "$tag"
        fi
        return 0
    else
        echo "Version '$v' didn't pass Regex '$regex'." 1>&2
        return 1
    fi
else
    echo "Version '$version' didn't pass Regex '$regex'." 1>&2
    return 1
fi
