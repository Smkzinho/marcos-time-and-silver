# Estrutura do projeto — Marcos Joias & Relógios

## Pastas
| Pasta | Conteúdo |
|---|---|
| `src/routes/` | Páginas: início, categoria, produto, busca, carrinho, conta, páginas institucionais (`info.$slug`). |
| `src/components/store/` | Cabeçalho, rodapé, logo, cartão e grade de produtos. |
| `src/config/store.ts` | Nome, textos da marca, banner, diferenciais, redes sociais, WhatsApp e políticas. |
| `src/data/commerce.ts` | Parcelamento, formas de pagamento e avisos de frete. |
| `src/data/images.ts` | Todas as fotos locais. |
| `src/data/categories.ts`, `src/data/products.ts` | Catálogo **demonstrativo**. |
| `src/types/catalog.ts` | Formato interno de produto, categoria e catálogo. |
| `src/services/catalog.ts` | Ponto único de leitura do catálogo pelas páginas. |
| `src/services/checkout.ts` | Converte o carrinho em itens para o checkout (com códigos de variação). |
| `src/services/nuvemshop/` | Integração com a API oficial (preparada, **não ativa**). |
| `src/lib/cart.tsx` | Carrinho salvo no navegador. |
| `src/test/` | Testes automáticos (`bunx vitest run`). |

## Integração Nuvemshop — estado atual
Nada está ligado à Nuvemshop. Sem credenciais, o site usa o catálogo demonstrativo e o botão
"Finalizar compra" avisa que o checkout está em preparação.

- `client.server.ts`: chamadas à API, apenas no servidor, com `NUVEMSHOP_STORE_ID` e `NUVEMSHOP_ACCESS_TOKEN`.
- `mappers.ts`: converte produtos/categorias/variações da Nuvemshop para os tipos internos.
- `catalog.functions.ts`: `fetchNuvemshopCatalog` busca o catálogo real (ainda não usado pelas páginas).
- `checkout.functions.ts`: `startNuvemshopCheckout` recebe os itens validados; retorna `checkoutUrl: null` até o fluxo oficial ser implementado.

## Passos para ativar
1. Criar o app na Nuvemshop e cadastrar as duas credenciais como segredos do servidor.
2. Testar `fetchNuvemshopCatalog` com a loja real e conferir os mapeadores.
3. Trocar `src/services/catalog.ts` para usar o catálogo real (mantendo o demonstrativo como reserva).
4. Implementar o fluxo oficial de checkout em `checkout.functions.ts` e testar uma compra.
5. Só então publicar.
