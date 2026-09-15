#!/usr/bin/env bash
# Startet eine öffentliche Demo der Website über einen Tunnel.
#
#   npm run demo                # Cloudflare Quick Tunnel (kein Account, URL wechselt bei jedem Start)
#   TUNNEL=ngrok npm run demo   # ngrok (einmalig: ngrok config add-authtoken <token>)
#
# Läuft, solange dieses Terminal offen ist. Strg+C beendet alles.
set -euo pipefail
cd "$(dirname "$0")/.."

TUNNEL="${TUNNEL:-cloudflare}"
PORT=4173
LOG_DIR="${TMPDIR:-/tmp}/prime-burger-demo"
mkdir -p "$LOG_DIR"
PIDS=()

cleanup() {
  echo
  echo "Demo wird beendet ..."
  for pid in "${PIDS[@]:-}"; do kill "$pid" 2>/dev/null || true; done
}
trap cleanup EXIT INT TERM

# 1. Backend
if ! curl -sf http://localhost:8000/up >/dev/null; then
  echo "▶ Backend starten (php artisan serve, Port 8000)"
  (cd backend && php artisan serve --port=8000 >"$LOG_DIR/api.log" 2>&1) &
  PIDS+=($!)
  for _ in $(seq 1 30); do curl -sf http://localhost:8000/up >/dev/null && break; sleep 0.5; done
else
  echo "▶ Backend läuft bereits auf :8000"
fi

# 2. Frontend-Build + Preview (Produktions-Build, /api und /storage werden zum Backend geproxyt)
echo "▶ Frontend bauen"
VITE_API_URL=/api npm run build --silent >"$LOG_DIR/build.log" 2>&1
echo "▶ Preview-Server auf :$PORT"
npx vite preview --port "$PORT" --strictPort >"$LOG_DIR/preview.log" 2>&1 &
PIDS+=($!)
for _ in $(seq 1 30); do curl -sf "http://localhost:$PORT/de" >/dev/null && break; sleep 0.5; done

# 3. Tunnel
echo "▶ Tunnel ($TUNNEL) öffnen"
case "$TUNNEL" in
  ngrok)
    command -v ngrok >/dev/null || { echo "ngrok ist nicht installiert: https://ngrok.com/download"; exit 1; }
    ngrok http "$PORT" --log=stdout --log-format=logfmt >"$LOG_DIR/tunnel.log" 2>&1 &
    PIDS+=($!)
    for _ in $(seq 1 30); do
      URL=$(curl -s http://127.0.0.1:4040/api/tunnels 2>/dev/null | grep -o '"public_url":"https://[^"]*"' | head -1 | cut -d'"' -f4 || true)
      [ -n "${URL:-}" ] && break; sleep 0.5
    done
    ;;
  *)
    CF="$(command -v cloudflared || echo "$HOME/.local/bin/cloudflared")"
    [ -x "$CF" ] || { echo "cloudflared fehlt. Installieren: curl -L -o ~/.local/bin/cloudflared https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64 && chmod +x ~/.local/bin/cloudflared"; exit 1; }
    # Bis zu 3 Versuche: die Quick-Tunnel-API antwortet gelegentlich mit Timeout.
    for attempt in 1 2 3; do
      "$CF" tunnel --url "http://localhost:$PORT" --no-autoupdate --edge-ip-version 4 >"$LOG_DIR/tunnel.log" 2>&1 &
      CF_PID=$!
      PIDS+=($CF_PID)
      for _ in $(seq 1 40); do
        URL=$(grep -o 'https://[a-z0-9-]*\.trycloudflare\.com' "$LOG_DIR/tunnel.log" | grep -v '^https://api\.' | head -1 || true)
        [ -n "${URL:-}" ] && break
        kill -0 "$CF_PID" 2>/dev/null || break
        sleep 0.5
      done
      [ -n "${URL:-}" ] && break
      echo "  Tunnel-Versuch $attempt fehlgeschlagen, neuer Versuch ..."
      kill "$CF_PID" 2>/dev/null || true
      sleep 2
    done
    ;;
esac

if [ -z "${URL:-}" ]; then
  echo "Tunnel-URL nicht gefunden, siehe $LOG_DIR/tunnel.log"
  exit 1
fi

echo
echo "═══════════════════════════════════════════════════════"
echo "  Demo läuft:  $URL/de"
echo "  Englisch:    $URL/en"
echo "  Admin:       $URL/admin"
echo "═══════════════════════════════════════════════════════"
echo "  Logs: $LOG_DIR   |   Beenden mit Strg+C"
echo
wait
