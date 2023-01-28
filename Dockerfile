FROM ubuntu:latest

ENV \
    DEBCONF_NONINTERACTIVE_SEEN="true" \
    DEBIAN_FRONTEND="noninteractive" \
    APT_KEY_DONT_WARN_ON_DANGEROUS_USAGE="DontWarn"

WORKDIR /app

# install intel-gpu-tools
RUN \
    apt-get -qq update \
    && \
    apt-get install --no-install-recommends -y \
        intel-gpu-tools \
        curl \
        ca-certificates

# install node.js 18
RUN \
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash - &&\
    apt-get install --no-install-recommends -y nodejs \
    && apt-get purge -y --auto-remove -o APT::AutoRemove::RecommendsImportant=false \
    && apt-get autoremove -y \
    && apt-get clean \
    && \
    rm -rf \
        /tmp/* \
        /var/lib/apt/lists/* \
        /var/cache/apt/* \
        /var/tmp/*

COPY . .

ENTRYPOINT ["node", "/app/index.js"]

LABEL \
    org.opencontainers.image.title="intel-gpu-exporter" \
    org.opencontainers.image.authors="xingo xu<xingoxu@gmail.com>" \
    org.opencontainers.image.source="https://github.com/xingoxu/intel-gpu-exporter"
