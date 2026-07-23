# Anima: Único — pronto para GitHub Pages

## O que foi ajustado

O repositório original dependia de um passo de build (Grunt + Sass/Compass)
de ~2013 para gerar dois arquivos que o `index.html` espera:

- `js/anima-unico.min.89.js` — todo o JavaScript do app concatenado
- `css/gumby.89.css` — o CSS do framework Gumby, compilado a partir do Sass

Esses arquivos gerados não estavam no zip (são artefatos de build, não
costumam ir pro controle de versão). Eu recriei os dois:

- **JS**: concatenei os ~209 arquivos-fonte na mesma ordem definida no
  `Gruntfile.js` original.
- **CSS**: compilei o Sass (`sass/gumby.scss`) com Dart Sass moderno. A
  biblioteca de mixins do Compass usada no projeto tinha várias funções
  (`power`, `golden_ratio`, `rhythm`, etc.) que só existiam na versão Ruby
  do Sass e não são mais suportadas — reimplementei essas funções em Sass
  puro (ver `sass/_ruby_sass_polyfill.scss`). Uma pequena simplificação:
  o tamanho-base da escala tipográfica (`$base-size`) foi reduzido de uma
  lista de dois valores para um valor único, pra evitar um bug de um caso
  extremo na lib de "modular scale" vendorizada — isso pode deixar
  *alguns* tamanhos de fonte com 1-2px de diferença do design original,
  nada estrutural.

Também corrigi um caminho absoluto (`/img/favicon.ico` → `img/favicon.ico`),
que quebraria se o site ficar hospedado numa subpasta
(`usuario.github.io/animaunico/`).

## O que NÃO funciona (e não tem problema)

O botão de **salvar/carregar personagem via link** dependia de um servidor
próprio do autor original (`helechaloscuro.net`), que não existe mais desde
~2014. O resto do gerador de personagens funciona 100% no navegador.

## Como publicar no GitHub Pages

1. Crie um repositório novo no GitHub (ex.: `animaunico`).
2. Suba todo o conteúdo desta pasta para o repositório (pela interface web,
   arrastando os arquivos, ou via `git add . && git commit && git push`).
3. No repositório, vá em **Settings → Pages**.
4. Em "Source", selecione a branch `main` (ou `master`) e a pasta `/ (root)`.
5. Salve. Em alguns minutos o site estará no ar em
   `https://SEU-USUARIO.github.io/NOME-DO-REPOSITORIO/`.

Pronto — não precisa rodar nenhum build, Node, Grunt ou Sass. É tudo
HTML/CSS/JS estático.
