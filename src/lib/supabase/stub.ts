function stubQueryResult<T = unknown>() {
  return {
    data: null as T | null,
    error: null,
    count: null,
    status: 200,
    statusText: "OK",
  };
}

function stubQueryBuilder() {
  const chain = () => stubQueryBuilder();
  const chainWithSelect = () => ({
    ...stubQueryBuilder(),
    order: chain,
    limit: chain,
    range: chain,
    single: () => Promise.resolve(stubQueryResult()),
    maybeSingle: () => Promise.resolve(stubQueryResult()),
    then: (onfulfilled?: (value: unknown) => unknown) => {
      const result = stubQueryResult();
      return Promise.resolve(onfulfilled ? onfulfilled(result) : result);
    },
  });
  return {
    select: () => chainWithSelect(),
    insert: () => ({
      ...chainWithSelect(),
      select: () => chainWithSelect(),
    }),
    update: () => ({
      ...chainWithSelect(),
      select: () => chainWithSelect(),
    }),
    delete: () => ({
      ...chainWithSelect(),
    }),
    upsert: () => ({
      ...chainWithSelect(),
      select: () => chainWithSelect(),
    }),
    eq: () => stubQueryBuilder(),
    neq: () => stubQueryBuilder(),
    gt: () => stubQueryBuilder(),
    gte: () => stubQueryBuilder(),
    lt: () => stubQueryBuilder(),
    lte: () => stubQueryBuilder(),
    like: () => stubQueryBuilder(),
    ilike: () => stubQueryBuilder(),
    is: () => stubQueryBuilder(),
    in: () => stubQueryBuilder(),
    contains: () => stubQueryBuilder(),
    containedBy: () => stubQueryBuilder(),
    rangeLt: () => stubQueryBuilder(),
    rangeGt: () => stubQueryBuilder(),
    rangeGte: () => stubQueryBuilder(),
    rangeLte: () => stubQueryBuilder(),
    rangeAdjacent: () => stubQueryBuilder(),
    overlaps: () => stubQueryBuilder(),
    textSearch: () => stubQueryBuilder(),
    filter: () => stubQueryBuilder(),
    not: () => stubQueryBuilder(),
    or: () => stubQueryBuilder(),
    and: () => stubQueryBuilder(),
    then: (onfulfilled?: (value: unknown) => unknown) => {
      const result = stubQueryResult();
      return Promise.resolve(onfulfilled ? onfulfilled(result) : result);
    },
  };
}

function stubAuth() {
  return {
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    getUser: () => Promise.resolve({ data: { user: null }, error: null }),
    signInWithPassword: () => Promise.resolve({ data: { user: null, session: null }, error: new Error("Supabase not configured") }),
    signUp: () => Promise.resolve({ data: { user: null, session: null }, error: new Error("Supabase not configured") }),
    signOut: () => Promise.resolve({ error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    exchangeCodeForSession: () => Promise.resolve({ data: { session: null, user: null }, error: new Error("Supabase not configured") }),
    refreshSession: () => Promise.resolve({ data: { session: null, user: null }, error: null }),
    setSession: () => Promise.resolve({ data: { session: null, user: null }, error: null }),
    resetPasswordForEmail: () => Promise.resolve({ data: {}, error: null }),
  };
}

function stubStorage() {
  return {
    from: () => ({
      upload: () => Promise.resolve({ data: null, error: new Error("Supabase not configured") }),
      download: () => Promise.resolve({ data: null, error: new Error("Supabase not configured") }),
      list: () => Promise.resolve({ data: [], error: null }),
      getPublicUrl: () => ({ data: { publicUrl: "" } }),
      createSignedUrl: () => Promise.resolve({ data: { signedUrl: "" }, error: null }),
      remove: () => Promise.resolve({ data: {}, error: null }),
      copy: () => Promise.resolve({ data: { path: "" }, error: null }),
      move: () => Promise.resolve({ data: {}, error: null }),
    }),
  };
}

export function createStubClient<T = unknown>() {
  return {
    from: () => stubQueryBuilder(),
    auth: stubAuth(),
    storage: stubStorage(),
    rpc: () => Promise.resolve({ data: null, error: null }),
    channel: () => ({
      on: () => ({ subscribe: () => {} }),
      subscribe: () => {},
      unsubscribe: () => {},
    }),
    realtime: { subscribe: () => {} },
    schema: () => ({ from: () => stubQueryBuilder() }),
    get url() { return "" },
    get supabaseUrl() { return "" },
    get supabaseKey() { return "" },
    get realtimeUrl() { return "" },
    get authUrl() { return "" },
    get storageUrl() { return "" },
    get functionsUrl() { return "" },
    get restUrl() { return "" },
    transaction: () => ({
      from: () => stubQueryBuilder(),
      rollback: () => {},
    }),
    functions: {
      invoke: () => Promise.resolve({ data: null, error: null }),
    },
  };
}