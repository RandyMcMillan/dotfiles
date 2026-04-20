
docker build --progress=plain . && img=$(docker build -q .) && docker run --rm --entrypoint sh "$img" -c 'set -e; make --version | head -n 1; bash --version | head -n 1; rustup --version; cargo --version; cargo-binstall --help >/dev/null && echo cargo-binstall-ok; cargo binstall --help >/dev/null && echo cargo-subcommand-ok'
