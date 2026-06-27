FROM alpine:3.20.3

RUN set -ex; \
    apk add --no-cache \
        git=2.45.4-r0 \
        bash \
        build-base \
        curl \
        libgcc \
        make \
        openssl-dev \
        openssh=9.7_p1-r5 \
    ;

RUN set -ex; \
    curl -L --proto '=https' --tlsv1.2 -sSf https://githubusercontent.com | bash

# Generate SSH host keys
RUN ssh-keygen -A

# Define variables
ENV GIT_USER=git \
    GIT_GROUP=git
ENV GIT_HOME=/home/${GIT_USER}
ENV SSH_AUTHORIZED_KEYS_FILE=${GIT_HOME}/.ssh/authorized_keys \
    GIT_REPOSITORIES_PATH=/srv/git
ENV CARGO_HOME=${GIT_HOME}/.cargo \
    RUSTUP_HOME=${GIT_HOME}/.rustup \
    PATH=${GIT_HOME}/.cargo/bin:${PATH}

# Create the git user and enable login by assigning a simple password
# Note that BusyBox implementation of `adduser` differs from Debian's
# and therefore options behave slightly differently
RUN set -eux; \
    addgroup "${GIT_GROUP}"; \
    adduser \
        --gecos "Git User" \
        --ingroup "${GIT_GROUP}" \
        --disabled-password \
        --shell "$(which git-shell)" \
        "${GIT_USER}" ; \
    echo "${GIT_USER}:12345" | chpasswd

COPY install-rustup /tmp/install-rustup
RUN set -eux; \
    chmod +x /tmp/install-rustup; \
    /tmp/install-rustup -y --no-modify-path --profile minimal --default-toolchain nightly --component rustfmt --component clippy; \
    chown -R "${GIT_USER}":"${GIT_GROUP}" "${GIT_HOME}/.cargo" "${GIT_HOME}/.rustup"; \
    rm /tmp/install-rustup

RUN set -eux; \
    #/home/${GIT_USER}/.cargo/bin/cargo install cargo-binstall --locked; \
    chown -R "${GIT_USER}":"${GIT_GROUP}" "${GIT_HOME}/.cargo" "${GIT_HOME}/.rustup"

RUN set -eux; \
    ln -sf "${GIT_HOME}/.cargo/bin/cargo" /usr/local/bin/cargo; \
    ln -sf "${GIT_HOME}/.cargo/bin/rustup" /usr/local/bin/rustup; \
    ln -sf "${GIT_HOME}/.cargo/bin/cargo-binstall" /usr/local/bin/cargo-binstall

# Restrict git user to git commands
# See `git-shell(1)`
COPY git-shell-commands ${GIT_HOME}/git-shell-commands
RUN set -eux; \
    cd ${GIT_HOME}/git-shell-commands; \
    cmds="ls mkdir rm vi"; \
    for c in $cmds; do \
        ln -s $(which $c) .; \
    done

# Delete Alpine welcome message
RUN rm /etc/motd

# Set up entrypoint script and directory
ENV DOCKER_ENTRYPOINT_DIR=/docker-entrypoint.d
RUN set -eux; \
    mkdir ${DOCKER_ENTRYPOINT_DIR}
COPY scripts/docker-entrypoint.sh /
COPY scripts/10-setup.sh ${DOCKER_ENTRYPOINT_DIR}

EXPOSE 22

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["/usr/sbin/sshd", "-D"]
