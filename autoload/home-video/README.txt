COMO TROCAR O VÍDEO DA HOME
============================

1. Coloque seu novo vídeo nesta pasta (autoload/home-video/).
   - Pode ter qualquer nome.
   - Formatos aceitos: .mp4 (recomendado), .mov, .webm

2. Na raiz do projeto, execute:

   ./tools/refresh-home-video.sh

   (Ou, se quiser que ele já comite e suba pro GitHub:
    ./tools/refresh-home-video.sh --push)

O script automaticamente:
- Detecta o vídeo mais recente nesta pasta
- Atualiza index.html para apontar pra ele
- Adiciona ?v=<timestamp> pra forçar navegadores a re-baixarem

A página catalogo.html tem fundo independente e NÃO é afetada
por mudanças nesta pasta.
