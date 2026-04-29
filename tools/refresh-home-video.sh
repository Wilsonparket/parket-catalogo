#!/bin/bash
# Atualiza o vídeo da home com o arquivo mais recente em autoload/home-video/.
# Uso:
#   ./tools/refresh-home-video.sh           # só atualiza index.html
#   ./tools/refresh-home-video.sh --push    # atualiza, comita e sobe pro GitHub
set -euo pipefail

cd "$(dirname "$0")/.."

DIR="autoload/home-video"
HTML="index.html"

if [ ! -d "$DIR" ]; then
  echo "Pasta nao existe: $DIR" >&2
  exit 1
fi

# Pega o vídeo mais recente (mp4/mov/webm, case insensitive). Lida com
# espaços nos nomes via stat + sort por mtime.
VIDEO=$(find "$DIR" -maxdepth 1 -type f \
  \( -iname '*.mp4' -o -iname '*.mov' -o -iname '*.webm' \) \
  -exec stat -f "%m %N" {} + 2>/dev/null \
  | sort -rn \
  | head -1 \
  | cut -d' ' -f2-)

if [ -z "${VIDEO:-}" ]; then
  echo "Nenhum video em $DIR/."
  echo "Adicione um arquivo .mp4 (.mov ou .webm) na pasta e rode de novo."
  exit 1
fi

VERSION=$(stat -f %m "$VIDEO")

# URL-encode o caminho (espaços viram %20, etc.) — preserva / . - _ ~
ENCODED_VIDEO=$(printf '%s' "$VIDEO" | perl -pe 's/([^A-Za-z0-9\-._~\/])/sprintf("%%%02X", ord($1))/ge')
export NEW_SRC="$ENCODED_VIDEO?v=$VERSION"

# Substitui o data-src do <video> em index.html (perl + env var = quoting seguro)
perl -i -pe 's{data-src="[^"]*"}{data-src="$ENV{NEW_SRC}"}g' "$HTML"

echo "Home video atualizado:"
echo "  Arquivo : $VIDEO"
echo "  data-src: $NEW_SRC"

if [ "${1:-}" = "--push" ]; then
  echo ""
  echo "Subindo para o GitHub..."
  git add "$HTML" "$VIDEO"
  git commit -m "Atualiza video da home: $(basename "$VIDEO")"
  git push origin main
  echo "Done."
else
  echo ""
  echo "Para subir:"
  echo "  git add $HTML \"$VIDEO\" && git commit -m 'Atualiza video da home' && git push"
fi
