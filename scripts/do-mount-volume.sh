#!/usr/bin/env bash

if [[ "$OSTYPE" == "linux-gnu" ]]; then
    if hash apt-get 2>/dev/null; then
      sudo apt-get purge do-agent
      curl -sSL https://repos.insights.digitalocean.com/install.sh | sudo bash
      /opt/digitalocean/bin/do-agent --version
    fi
    # Create a mount point for your volume:
    mkdir -p /home/git

    # Mount your volume at the newly-created mount point:
    mount -o discard,defaults,noatime /dev/disk/by-id/scsi-0DO_Volume_git /home/git

    # Change fstab so the volume will be mounted after a reboot
    echo '/dev/disk/by-id/scsi-0DO_Volume_git /home/git ext4 defaults,nofail,discard 0 0' | sudo tee -a /etc/fstab
    adduser git
    usermod -aG sudo git
    su - git

elif [[ "$OSTYPE" == "darwin"* ]]; then
    echo TODO add support for $OSTYPE
elif [[ "$OSTYPE" == "cygwin" ]]; then
    echo TODO add support for $OSTYPE
elif [[ "$OSTYPE" == "msys" ]]; then
    echo TODO add support for $OSTYPE
elif [[ "$OSTYPE" == "win32" ]]; then
    echo TODO add support for $OSTYPE
elif [[ "$OSTYPE" == "freebsd"* ]]; then
    echo TODO add support for $OSTYPE
else
    echo TODO add support for $OSTYPE
fi

