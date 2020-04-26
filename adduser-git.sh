#!/usr/bin/env bash

adduser-git() {

adduser git
usermod -aG sudo git

su - git

}
adduser-git

