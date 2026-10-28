# Pedro Pires — Illustration and Design

Portfolio de ilustração bilingue PT/EN, em Astro e TypeScript, com identidade Dark Graphic Novel. Oito páginas, 81 obras autorizadas pelo artista e 162 variantes WebP locais, com proporções preservadas.

- Website: https://tiagoapsantos.github.io/pedro-pires-portfolio/
- Repositório: https://github.com/tiagoapsantos/pedro-pires-portfolio

## Desenvolvimento e validação

Node.js 24 ou superior e npm.

~~~sh
npm ci
npm run dev
npm test
npm run check
npm run build
npm run audit:build
npm run preview
~~~

O servidor utiliza a subpasta /pedro-pires-portfolio/. O build estático fica em dist/; não publicar a raiz do projecto.

Os testes verificam catálogo, filtros, rotas bilingues, selecção, proporções e metadados das WebP. A auditoria valida oito rotas e 404, 162 variantes exactas, referências locais dentro da subpasta, canonical, hreflang, sitemap, robots e .nojekyll, bem como ausência de documentação, originais e ficheiros de desenvolvimento no build.

Os originais e o manifesto privado de proveniência não são publicados no repositório. O teste de SHA-256 dos originais executa-se quando assets/artwork-sources.json existe; num clone público é explicitamente ignorado. As restantes verificações e a auditoria de todas as WebP continuam a executar-se. A revisão local anterior à publicação verifica também os 81 originais.

## Estrutura e conteúdos

| Página | PT | EN |
| --- | --- | --- |
| Início | / | /en/ |
| Portfolio | /portfolio/ | /en/portfolio/ |
| Sobre | /sobre/ | /en/about/ |
| Contactos | /contactos/ | /en/contact/ |

As rotas da tabela são relativas à subpasta pública. src/data/site.ts mantém os idiomas e contactos. src/data/publication.ts define a origem pública e subpasta; astro.config.mjs reutiliza essa configuração. Os componentes usam BASE_URL para navegação e recursos. O CSS de fontes é processado pelo Vite, que aplica o base configurado.

Vistas em src/views/, componentes em src/components/, estilos em src/styles/global.css e interacções em src/scripts/gallery.ts. A mudança de idioma preserva a página. O sitemap é gerado em src/pages/sitemap.xml.ts a partir das oito rotas. A página 404 é bilingue, com ligações seguras ao início PT/EN, e não é indexada.

Títulos e créditos não confirmados permanecem vazios. Não há legendas individuais nem identificadores visíveis. As categorias aparecem apenas nos filtros; textos alternativos descritivos PT/EN e informação acessível da ampliação são preservados. Filtros anunciam contagens, lightbox preserva a obra integral, com setas, Escape, foco contido e reposição de foco. Sem JavaScript, as imagens continuam visíveis.

Email confirmado: pedro.insider@gmail.com. Facebook: https://www.facebook.com/Pedro.Pires.Illustration/. A plataforma pode bloquear a verificação automática; o URL confirmado não deve ser substituído por uma alternativa adivinhada. Sem formulário, backend, analytics ou pedidos externos de fontes.

## Imagens e manutenção

As 81 imagens integrais e 81 miniaturas ficam em public/images/artworks/. O catálogo de interface é src/data/artwork-catalogue.json; src/data/artworks.ts define tipos, categorias e selecção da Homepage. Não alterar IDs ou categorias sem rever referências. Fontes: Bebas Neue e Space Grotesk, em WOFF2 local, com licenças SIL OFL em public/fonts/.

Os originais recebidos, manifesto de proveniência, documentação de trabalho e configurações locais permanecem fora do Git através de .gitignore. Nunca adicionar credenciais nem remover exclusões para facilitar uma publicação.

Para actualizar imagens com autorização:

1. Fazer uma cópia de segurança local do manifesto, catálogo e WebP; preservar os originais existentes.
2. Guardar a nova fonte com nome distinto em assets/originals/ e actualizar o manifesto privado com SHA-256, ID estável quando se trata da mesma obra, categoria e alternativas PT/EN. Uma obra distinta exige novo ID e revisão de todas as referências de destaque.
3. Executar npm run images apenas no ambiente local que contém os assets privados. O script regenera TODAS as cópias públicas e o catálogo e sobrescreve as WebP; não é executado no workflow de publicação. Não amplia a resolução original nem altera os originais.
4. Rever composições sem cortes, filtros e lightbox, retirar apenas variantes antigas comprovadamente sem referência e conservar uma cópia fora da pasta pública. Alterações intencionais à contagem exigem rever os testes e a auditoria.
5. Executar testes, check, build e audit:build. Rever PT/EN em desktop, tablet e 320 px, foco, teclado e recursos. Submeter apenas fontes de código e recursos públicos necessários.

## GitHub Pages

.github/workflows/pages.yml executa npm ci, testes, Astro/TypeScript, build e auditoria. Usa exclusivamente Actions oficiais fixadas por commit. Publica apenas dist/ através de upload-pages-artifact e deploy-pages, com permissões mínimas e environment github-pages. Pull requests executam validação sem publicar; push para main ou execução manual permite publicação. Em Settings → Pages, a origem deve ser GitHub Actions.

A versão pública permite indexação nas oito páginas e inclui canonical, alternates PT/EN, sitemap e robots. O robots.txt desta subpasta não controla outros projectos do mesmo domínio; os metadados das páginas são específicos deste website. Sem domínio personalizado ou serviços pagos.

Depois de uma alteração, verificar o workflow até terminar e rever o endereço HTTPS público, as oito rotas, a página 404, fontes, imagens e ligações. Não considerar um push equivalente a publicação concluída sem confirmar o resultado da Action e o website.

As ilustrações pertencem ao artista. A autorização para este portfolio não concede autorização de reutilização das obras por terceiros. As fontes mantêm as respectivas licenças incluídas.
