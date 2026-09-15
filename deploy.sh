#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"

git pull --ff-only

docker compose -f docker-compose.prod.yml up -d --build --remove-orphans

for i in {1..30}; do
  if docker compose -f docker-compose.prod.yml exec -T api php artisan about --only=environment >/dev/null 2>&1; then
    break
  fi
  sleep 2
  if [ "$i" = "30" ]; then
    echo "API did not become ready in time" >&2
    exit 1
  fi
done

docker compose -f docker-compose.prod.yml exec -T api php artisan migrate --force
# Kein storage:link nötig: nginx liefert /storage direkt aus dem Volume storage_public.
docker compose -f docker-compose.prod.yml exec -T api php artisan optimize

docker image prune -f
