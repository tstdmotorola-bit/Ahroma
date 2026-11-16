# AH!ROMA — preparo da conexão Asaas

## Estado desta etapa

Checkout não implementado nem ativado. Nenhum botão de compra, chamada financeira, publicação, alteração de preço, escrita no catálogo ou infraestrutura adicional foi criado.

Arquitetura lida em `AGENTS.md`. A vitrine existente continua lendo a fonte independente por REST público. A consulta aos nomes dos segredos confirmou que `ASAAS_API_KEY` não está configurado; nenhum valor secreto foi lido.

As regras desta sessão impedem implementar código de pagamentos antes de habilitar pagamentos no editor Lovable. A habilitação não está disponível aqui. As regras também exigem Lovable Cloud para nova funcionalidade privada de servidor, mas o proprietário proibiu provisionar uma segunda base: não habilitar Cloud automaticamente. A documentação atual de integrações diretas informa suporte a segredos e funções TanStack Start sem backend integrado; esse caminho precisa ser liberado no editor antes da implementação, preservando a fonte remota somente leitura.

## Contrato para implementação posterior

- Função interna POST via `createServerFn`, módulo `*.functions.ts` em `src/lib/`; auxiliar privado `*.server.ts`. Preservar a proteção CSRF já existente em `src/start.ts`.
- Browser envia exclusivamente identificador permanente do produto e quantidade. Validação estrita rejeita preço, total, nome, URLs, dados de cartão e campos desconhecidos. Quantidade deve ser inteiro positivo seguro; o limite comercial ainda precisa ser informado, sem inventar um máximo.
- Servidor consulta novamente o produto ativo na fonte atual por GET com a chave pública; resolve o alias antigo de Invictus. Não usar preço de cache do browser nem fallback legado como fonte de venda. Produto ausente/inativo, resposta inválida, erro de leitura ou valor em centavos inválido impedem criação.
- Nome, marca e `price_cents` vêm exclusivamente dessa leitura. Validar aritmética segura em centavos para a quantidade; converter para a unidade exigida pela API somente ao montar a requisição. Não modificar a fonte remota, slugs, nomes, preços ou permissões.
- Segredo `ASAAS_API_KEY` lido apenas dentro do servidor em tempo de execução, enviado ao Asaas pelo header `access_token`. Nunca devolver, registrar, incluir em mensagens de erro ou expor ao browser. Sem chave inventada ou placeholder.
- Ambiente explícito e obrigatório, sem default automático para produção; chave precisa corresponder ao ambiente confirmado. Flag de habilitação false por padrão. Ausência de chave, ambiente, aprovação das condições ou flag impede qualquer POST ao Asaas, inclusive por chamada direta à função.
- Checkout hospedado usa somente meios confirmados entre `PIX` e `CREDIT_CARD`. Não oferecer boleto. Não ativar parcelamento, recorrência, frete gratuito ou condições de entrega sem aprovação.
- Usar apenas destinos Asaas oficiais fixados no servidor, timeout e tratamento sanitizado de falhas; validar formato da resposta e identificador antes de construir o link hospedado. Não aceitar destino/API URL ou callback do browser.
- Callbacks serão URLs fixas de páginas reais do projeto, a criar junto com as referências. Voltar do Asaas não confirma pagamento. Nunca exibir “pago” com base em parâmetros da URL.
- Antes de liberar produção, definir persistência de pedidos e idempotência, prevenção de duplicatas/abuso e confirmação autenticada por webhook. Isso não autoriza criar segunda base ou escrever na fonte do catálogo: resolver armazenamento autorizado com o proprietário primeiro.

## Validações posteriores, sem transações externas

Testes com transporte simulado, sem chave fictícia gravada e sem chamadas à API financeira:

1. Flag desativada e configurações ausentes: zero chamadas Asaas.
2. Quantidade zero, negativa, fracionária, não numérica ou fora da aritmética segura: rejeição.
3. Campo de preço enviado pelo browser: rejeição, nunca aceitação silenciosa.
4. Preço do servidor divergente do browser: valor da fonte atual usado, sem alterações na base.
5. Produto inativo/ausente ou leitura indisponível: zero criação de checkout; nenhuma venda por fallback legado.
6. Nenhuma requisição de escrita ao catálogo e nenhum segredo na resposta ou erro.
7. Boleto e parcelamento não aprovados: rejeição.
8. Timeout, resposta inválida e erro do Asaas: falha segura, sem retry automático que possa duplicar criação.
9. Retorno do checkout: navegação apenas, sem confirmação financeira.

Esses testes de checkout ainda não existem: não seria correto apresentá-los como executados sem a implementação permitida. Os testes existentes do catálogo podem ser executados sem credenciais Asaas.

## Configuração e bloqueios

1. No editor do projeto existente, solicitar preparo da integração direta Asaas sem nova base. Não habilitar Stripe/Paddle como substituição e não criar cobranças.
2. Confirmar Sandbox ou Produção. Não solicitar chave antes dessa definição e da liberação do caminho de servidor/segredos.
3. Quando liberado, cadastrar `ASAAS_API_KEY` exclusivamente em **Settings → Secrets** no editor, pela entrada segura. Nunca pelo chat ou código. Os documentos Lovable não publicam um deep link suportado para esse formulário; não inventar URL de Secrets.
4. Informar meios aceitos, entrega/custo/regiões/prazo e condições comerciais, limite de quantidade, expiração e destinos de retorno; não presumir nenhuma dessas regras.
5. Manter flag desligada. Cadastro do segredo não autoriza ativação, publicação, checkout de teste ou cobrança real.

## Fontes oficiais consultadas

- https://docs.asaas.com/docs/checkout-asaas
- https://docs.asaas.com/reference/criar-novo-checkout
- https://docs.lovable.dev/integrations/any-api
- https://docs.lovable.dev/features/secrets

Asaas documenta `billingTypes` PIX/CREDIT_CARD; `chargeTypes` DETACHED/INSTALLMENT/RECURRENT; callback e items obrigatórios; expiração de 10 a 1440 minutos quando configurada. Criar checkout retorna um identificador e não confirma pagamento. Campos internos completos, autenticação e URLs de cada ambiente devem ser reconferidos na referência oficial antes de escrever o cliente de API.