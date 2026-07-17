// A reusable create / update / delete helper built on the data-layer's
// useApiRequest hook. Every "list" screen fetches internally through
// ConfigurableDashboard, so here we only need the mutating verbs.
//
// This mirrors the README's useUserManagement example, generalised so all six
// modules can share it.

import { useApiRequest } from '@msbc/data-layer';

export function useCrud(basePath: string) {
  // One hook per verb. The URL for update/delete is set at call time via the
  // execute() override, so a single instance handles any id.
  const create = useApiRequest({
    url: basePath,
    method: 'post',
    autoFetch: false,
    config: { authRequired: true },
  });

  const update = useApiRequest({
    url: '',
    method: 'put',
    autoFetch: false,
    config: { authRequired: true },
  });

  const remove = useApiRequest({
    url: '',
    method: 'delete',
    autoFetch: false,
    config: { authRequired: true },
  });

  return {
    createItem: (body: Record<string, unknown>) => create.execute({ body }),
    updateItem: (id: string | number, body: Record<string, unknown>) =>
      update.execute({ url: `${basePath}/${id}`, body }),
    removeItem: (id: string | number) => remove.execute({ url: `${basePath}/${id}` }),
    loading: create.loading || update.loading || remove.loading,
  };
}
