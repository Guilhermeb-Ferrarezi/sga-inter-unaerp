import { useQuery, type DocumentNode, type OperationVariables } from "@apollo/client";

/**
 * Wrapper sobre useQuery do Apollo com fallback automático para mock.
 *
 * Comportamento:
 * - Se a query carregar com sucesso → retorna dados da API
 * - Se a query falhar (rede / API offline / erro 5xx) → retorna mock
 * - Estado de loading só é true na primeira renderização
 *
 * Útil enquanto a API ainda não está acessível em produção e durante dev local
 * com o backend desligado.
 */
export function useGraphQLData<TData, TVars extends OperationVariables = OperationVariables>(
  query: DocumentNode,
  options: {
    variables?: TVars;
    fallback: TData;
    /**
     * Função pra extrair o subset desejado da resposta GraphQL.
     * Quando a query retorna `{ activeEdition: {...} }` você pode passar
     * `(d) => d.activeEdition` pra desempacotar.
     */
    select?: (data: TData) => TData;
    /**
     * Pular a query (útil em rotas dinâmicas antes do param resolver).
     */
    skip?: boolean;
  }
): { data: TData; loading: boolean; error: boolean; usingFallback: boolean } {
  const result = useQuery<TData, TVars>(query, {
    variables: options.variables,
    skip: options.skip,
    errorPolicy: "all",
  });

  const hasData = result.data && Object.keys(result.data).length > 0;
  const usingFallback = !!result.error && !hasData;

  let data: TData;
  if (usingFallback) {
    data = options.fallback;
  } else if (hasData) {
    data = options.select ? options.select(result.data!) : result.data!;
  } else {
    data = options.fallback;
  }

  return {
    data,
    loading: result.loading && !hasData,
    error: !!result.error,
    usingFallback,
  };
}
