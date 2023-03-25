#!/usr/bin/env bash
#run pi-hole as a docker service on macos
changePW() {
echo "resetPW"
docker exec -it pihole /bin/bash pihole -a -p
}

run() {

    if hash brew 2>/dev/null; then

        brew update
        brew upgrade
        brew install docker
        #docker --version
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
            #exit 0
            return 0
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
}
run

#ADD your docker commands here to config the container

changePW() {
echo "resetPW"
docker exec -it pihole /bin/bash pihole -a -p
}
changePW

#host machine config #or nested VM's config
configNetwork(){
networksetup -setdnsservers Wi-Fi 127.0.0.1
networksetup -setdnsservers Ethernet 127.0.0.1
#SEARCHDOMAIN=$(networksetup -getsearchdomains en0) #use this to preserve existing search domains
SEARCHDOMAIN=duckduckgo.com
sudo networksetup -setsearchdomains Ethernet $SEARCHDOMAIN # additionalDomain
sudo networksetup -setsearchdomains Wi-Fi $SEARCHDOMAIN # additionalDomain
}
configNetwork

$(open http://$(ipconfig getifaddr en0)/admin)
