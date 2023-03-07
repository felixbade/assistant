if [ -z "$1" ]; then
    echo "Usage: $0 <env-file>"
    exit 1
else
    source $1
fi

HOST="$SSH_USER@$DOMAIN"

# # https://stackoverflow.com/a/63438492
rsync -vhra dist/* $HOST:$WWW_DIR --delete-after