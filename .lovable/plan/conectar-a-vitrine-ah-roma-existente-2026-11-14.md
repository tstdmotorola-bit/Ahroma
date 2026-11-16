# Conectar a vitrine AH!ROMA existente

- Ler os 30 produtos ativos da base independente informada usando apenas a chave pública e requisições REST de leitura; não criar outra base nem alterar permissões.
- Manter cores, fontes, busca e preços em reais. Ordenar por `sort_order` e preservar as páginas individuais.
- Usar fotos do bucket público `perfume-images` quando `image_path` estiver preenchido; mostrar um placeholder identificado quando vazio ou quando a foto não carregar.
- Acrescentar estados de carregamento, catálogo vazio, erro e tentativa novamente.
- Preservar os oito endereços antigos: usar o produto correspondente da base quando existir; os produtos antigos ausentes continuam acessíveis pelo endereço antigo, sem acrescentar itens à vitrine dos 30 ativos.
- Conferir leitura real, busca, página individual e apresentação em celular; executar testes e solicitar publicação após a verificação de segurança.

## Detalhes técnicos
- REST público com header `apikey`, sem `Authorization` com chave opaca, sem service role e sem comandos de escrita.
- TanStack Query com carregamento pela página e cache por requisição; busca na URL.
- A base informada será a fonte dos preços da vitrine. Nenhuma foto será importada nesta etapa: bucket vazio e pacote não anexado.