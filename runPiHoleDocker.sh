#!/usr/bin/env bash

checkbrew() {

    if hash brew 2>/dev/null; then

        brew update
        brew upgrade
        brew install docker
        docker --version
        open /Applications/Docker.app

        # https://github.com/pi-hole/docker-pi-hole/blob/master/README.md
        CONTAINER="/pihole"
        RUNNING=$(docker inspect --format="{{ .State.Running }}" $CONTAINER 2> /dev/null)
        if [ $? -eq 1 ]; then
            echo "'$CONTAINER' does not exist."
        else
            /usr/local/bin/docker kill         $CONTAINER
            /usr/local/bin/docker rm   --force $CONTAINER
        fi

        export IP=$(ipconfig getifaddr en0)
    docker run -d \
        --name pihole \
        -p 53:53/tcp -p 53:53/udp \
        -p 80:80 \
        -p 443:443 \
        -e TZ="America/Chicago" \
        -v "$(pwd)/etc-pihole/:/etc/pihole/" \
        -v "$(pwd)/etc-dnsmasq.d/:/etc/dnsmasq.d/" \
        --dns=$(ipconfig getifaddr en0) --dns=1.1.1.1 \
        --restart=unless-stopped \
        pihole/pihole:latest

    printf 'Starting up pihole container '
    for i in $(seq 1 20); do
        if [ "$(docker inspect -f "{{.State.Health.Status}}" pihole)" == "healthy" ] ; then
            printf ' OK'
            echo -e "\n$(docker logs pihole 2> /dev/null | grep 'password:') for your pi-hole: http://${IP}/admin/"
            exit 0
        else
            sleep 3
            printf '.'
        fi
        if [ $i -eq 20 ] ; then
            echo -e "\nTimed out waiting for Pi-hole start, consult check your container logs for more info (\`docker logs pihole\`)"
            exit 1
        fi
    done;
    else
        /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
        checkbrew
    fi
docker ps -a
networksetup -setdnsservers Wi-Fi 127.0.0.1
$(open http://$(IP)/admin)
}
checkbrew
