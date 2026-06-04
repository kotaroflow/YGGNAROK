insert into public.permissions(key, module, description)
values
  ('ai_council.evolve', 'ai_council', 'Gerenciar evolucao constante e memoria persistente das IAs'),
  ('ai_council.memory_review', 'ai_council', 'Revisar memorias persistentes sugeridas pelas IAs'),
  ('ai_council.n8n_visual_map', 'ai_council', 'Gerenciar mapa visual operacional de agentes no n8n')
on conflict (key) do nothing;

alter table public.agent_runs
  drop constraint if exists agent_runs_agent_key_check;

alter table public.agent_runs
  add constraint agent_runs_agent_key_check check (
    agent_key in (
      'heimdall',
      'janus',
      'isis',
      'maat',
      'athena',
      'hotei',
      'hefesto',
      'tenjin',
      'amaterasu',
      'benzaiten',
      'daedalus',
      'orpheus',
      'gaia',
      'inari',
      'hermes',
      'ebisu',
      'daikokuten',
      'fuxi',
      'omoikane',
      'hachiman',
      'mnemosyne',
      'wenchang',
      'hypnos',
      'yomi',
      'themis',
      'zhong_kui',
      'susanoo',
      'asclepio',
      'raphael',
      'metatron',
      'astraea',
      'yama',
      'caishen',
      'nuwa',
      'ame_no_uzume',
      'sarutahiko',
      'gabriel',
      'pandora',
      'anubis',
      'nemesis',
      'morax'
    )
  );

insert into public.ai_council_agents(key, name, role, risk_level, provider_preference, config)
values
  ('heimdall', 'Heimdall', 'roteamento', 'medium', '{"primary":"openrouter","fallback":"ollama"}', '{"enabled":true,"layer":"coordenacao","can_execute":[],"requires_admin_for":["automacao_persistente","mudanca_de_rota_global"]}'),
  ('janus', 'Janus', 'fluxos e transicoes de estado', 'medium', '{"primary":"openrouter","fallback":"ollama"}', '{"enabled":true,"layer":"coordenacao","can_execute":[],"requires_admin_for":["alteracao_de_estado_critico","retry_loop_persistente"]}'),
  ('isis', 'Isis', 'triagem e lucidez', 'low', '{"primary":"openrouter","fallback":"ollama"}', '{"enabled":true,"layer":"lucidez","can_execute":[],"requires_admin_for":["mudanca_de_objetivo"]}'),
  ('maat', 'Maat', 'justica e coerencia', 'medium', '{"primary":"openrouter","fallback":"ollama"}', '{"enabled":true,"layer":"juizo","can_execute":[],"requires_admin_for":["aprovacao_de_risco_medio"]}'),
  ('athena', 'Athena', 'estrategia', 'medium', '{"primary":"openrouter","fallback":"ollama"}', '{"enabled":true,"layer":"bases_divergentes","can_execute":[],"requires_admin_for":["mudanca_estrategica_global"]}'),
  ('hotei', 'Hotei', 'assistente pet', 'low', '{"primary":"openrouter/free","fallback":"ollama"}', '{"enabled":true,"layer":"especialista","can_execute":[],"requires_admin_for":[]}'),
  ('hefesto', 'Hefesto', 'prompts e ideias', 'low', '{"primary":"openrouter/free","fallback":"ollama"}', '{"enabled":true,"layer":"especialista","can_execute":[],"requires_admin_for":["publicacao"]}'),
  ('tenjin', 'Tenjin', 'tutoriais', 'low', '{"primary":"openrouter/free","fallback":"ollama"}', '{"enabled":true,"layer":"especialista","can_execute":[],"requires_admin_for":[]}'),
  ('amaterasu', 'Amaterasu', 'criacao de conteudo', 'low', '{"primary":"openrouter/free","fallback":"ollama"}', '{"enabled":true,"layer":"especialista","can_execute":[],"requires_admin_for":["publicacao"]}'),
  ('benzaiten', 'Benzaiten', 'estetica', 'low', '{"primary":"openrouter/free","fallback":"ollama"}', '{"enabled":true,"layer":"especialista","can_execute":[],"requires_admin_for":["uso_de_marca_sensivel"]}'),
  ('daedalus', 'Daedalus', 'geracao tecnica', 'medium', '{"primary":"openrouter","fallback":"ollama"}', '{"enabled":true,"layer":"especialista","can_execute":[],"requires_admin_for":["alteracao_de_codigo","alteracao_de_banco"]}'),
  ('orpheus', 'Orpheus', 'voz e storytelling', 'low', '{"primary":"openrouter/free","fallback":"ollama"}', '{"enabled":true,"layer":"especialista","can_execute":[],"requires_admin_for":["publicacao"]}'),
  ('gaia', 'Gaia', 'monetizacao', 'medium', '{"primary":"openrouter","fallback":"ollama"}', '{"enabled":true,"layer":"produto","can_execute":[],"requires_admin_for":["gastos","oferta_sensivel"]}'),
  ('inari', 'Inari', 'copy e oferta', 'medium', '{"primary":"openrouter","fallback":"ollama"}', '{"enabled":true,"layer":"produto","can_execute":[],"requires_admin_for":["publicacao","oferta_sensivel"]}'),
  ('hermes', 'Hermes', 'distribuicao', 'medium', '{"primary":"openrouter","fallback":"ollama"}', '{"enabled":true,"layer":"produto","can_execute":[],"requires_admin_for":["publicacao","integracao_externa"]}'),
  ('ebisu', 'Ebisu', 'parcerias e links', 'medium', '{"primary":"openrouter","fallback":"ollama"}', '{"enabled":true,"layer":"produto","can_execute":[],"requires_admin_for":["link_afiliado","parceria"]}'),
  ('daikokuten', 'Daikokuten', 'campanhas', 'medium', '{"primary":"openrouter","fallback":"ollama"}', '{"enabled":true,"layer":"produto","can_execute":[],"requires_admin_for":["gastos","publicacao"]}'),
  ('fuxi', 'Fuxi', 'estrategia de nicho', 'medium', '{"primary":"openrouter","fallback":"ollama"}', '{"enabled":true,"layer":"produto","can_execute":[],"requires_admin_for":["reposicionamento_global"]}'),
  ('omoikane', 'Omoikane', 'relatorios', 'low', '{"primary":"openrouter/free","fallback":"ollama"}', '{"enabled":true,"layer":"inteligencia","can_execute":[],"requires_admin_for":[]}'),
  ('hachiman', 'Hachiman', 'aprendizado global', 'medium', '{"primary":"openrouter","fallback":"ollama"}', '{"enabled":true,"layer":"memoria","can_execute":[],"requires_admin_for":["memoria_global"]}'),
  ('mnemosyne', 'Mnemosyne', 'memoria', 'medium', '{"primary":"openrouter","fallback":"ollama"}', '{"enabled":true,"layer":"memoria","can_execute":["propor_memoria"],"requires_admin_for":["memoria_high_risk","dados_sensiveis"]}'),
  ('wenchang', 'Wenchang', 'biblioteca', 'low', '{"primary":"openrouter/free","fallback":"ollama"}', '{"enabled":true,"layer":"memoria","can_execute":["classificar_referencia"],"requires_admin_for":["exclusao"]}'),
  ('hypnos', 'Hypnos', 'lixeira inteligente e reaproveitamento', 'medium', '{"primary":"openrouter","fallback":"ollama"}', '{"enabled":true,"layer":"memoria","can_execute":[],"requires_admin_for":["exclusao","restauracao_em_massa"]}'),
  ('yomi', 'Yomi', 'direitos autorais', 'high', '{"primary":"openrouter","fallback":"ollama"}', '{"enabled":true,"layer":"governanca","can_execute":[],"requires_admin_for":["publicacao_sensivel","uso_de_personagem_protegido"]}'),
  ('themis', 'Themis', 'regras e LGPD', 'high', '{"primary":"openrouter","fallback":"ollama"}', '{"enabled":true,"layer":"governanca","can_execute":[],"requires_admin_for":["auth","lgpd","politica_de_dados"]}'),
  ('zhong_kui', 'Zhong Kui', 'conteudo problematico', 'high', '{"primary":"openrouter","fallback":"ollama"}', '{"enabled":true,"layer":"governanca","can_execute":[],"requires_admin_for":["publicacao_sensivel"]}'),
  ('susanoo', 'Susanoo', 'seguranca', 'high', '{"primary":"openrouter","fallback":"ollama"}', '{"enabled":true,"layer":"governanca","can_execute":[],"requires_admin_for":["seguranca","auth","permissao"]}'),
  ('asclepio', 'Asclepio', 'saude do sistema', 'medium', '{"primary":"openrouter","fallback":"ollama"}', '{"enabled":true,"layer":"operacoes","can_execute":[],"requires_admin_for":["alteracao_de_runtime"]}'),
  ('raphael', 'Raphael', 'recuperacao', 'medium', '{"primary":"openrouter","fallback":"ollama"}', '{"enabled":true,"layer":"operacoes","can_execute":[],"requires_admin_for":["restauracao","rollback"]}'),
  ('metatron', 'Metatron', 'logs e permissoes', 'high', '{"primary":"openrouter","fallback":"ollama"}', '{"enabled":true,"layer":"auditoria","can_execute":["registrar_auditoria"],"requires_admin_for":["alteracao_de_permissao"]}'),
  ('astraea', 'Astraea', 'XP e rank', 'low', '{"primary":"openrouter/free","fallback":"ollama"}', '{"enabled":true,"layer":"evolucao","can_execute":[],"requires_admin_for":["alteracao_de_rank_global"]}'),
  ('yama', 'Yama', 'karma', 'medium', '{"primary":"openrouter","fallback":"ollama"}', '{"enabled":true,"layer":"evolucao","can_execute":[],"requires_admin_for":["penalidade"]}'),
  ('caishen', 'Caishen', 'recompensas', 'medium', '{"primary":"openrouter","fallback":"ollama"}', '{"enabled":true,"layer":"evolucao","can_execute":[],"requires_admin_for":["recompensa_financeira"]}'),
  ('nuwa', 'Nuwa', 'onboarding', 'low', '{"primary":"openrouter/free","fallback":"ollama"}', '{"enabled":true,"layer":"usuario","can_execute":[],"requires_admin_for":[]}'),
  ('ame_no_uzume', 'Ame-no-Uzume', 'interface e UX', 'low', '{"primary":"openrouter/free","fallback":"ollama"}', '{"enabled":true,"layer":"interface","can_execute":[],"requires_admin_for":["mudanca_visual_global"]}'),
  ('sarutahiko', 'Sarutahiko', 'postagem manual', 'medium', '{"primary":"openrouter","fallback":"ollama"}', '{"enabled":true,"layer":"usuario","can_execute":[],"requires_admin_for":["publicacao"]}'),
  ('gabriel', 'Gabriel', 'notificacoes', 'medium', '{"primary":"openrouter","fallback":"ollama"}', '{"enabled":true,"layer":"usuario","can_execute":[],"requires_admin_for":["notificacao_em_massa"]}'),
  ('pandora', 'Pandora', 'testes', 'medium', '{"primary":"openrouter","fallback":"ollama"}', '{"enabled":true,"layer":"qualidade","can_execute":[],"requires_admin_for":["teste_destrutivo"]}'),
  ('anubis', 'Anubis', 'auditoria final', 'high', '{"primary":"openrouter","fallback":"ollama"}', '{"enabled":true,"layer":"auditoria","can_execute":[],"requires_admin_for":["aprovacao_final_high_risk"]}'),
  ('nemesis', 'Nemesis', 'risco de marca', 'high', '{"primary":"openrouter","fallback":"ollama"}', '{"enabled":true,"layer":"governanca","can_execute":[],"requires_admin_for":["risco_reputacional"]}')
on conflict (key) do update set
  name = excluded.name,
  role = excluded.role,
  risk_level = excluded.risk_level,
  provider_preference = excluded.provider_preference,
  config = public.ai_council_agents.config || excluded.config || '{"response_format":"structured_json","admin_is_final_authority":true}'::jsonb,
  updated_at = now();

insert into public.ai_automations(key, name, status, interval_ms, metadata)
values
  ('hierarchy_evolution_loop', 'YGGNAROK Hierarchy Evolution Loop', 'active', 300000, '{"source":"worker","loop":["capture","reflect","propose","approve","apply","audit"],"critical_actions_require_admin":true}'),
  ('persistent_memory_consolidation', 'Persistent Memory Consolidation', 'active', 300000, '{"source":"worker","storage":["library_items.ai_learning","ai_memory_candidates","ai_vector_memory"],"medium_and_high_risk_require_review":true}'),
  ('agent_route_review', 'Agent Route Review', 'active', 600000, '{"source":"worker","purpose":"revisar rotas eficazes e falhas recorrentes","writes_memory_candidates":true}'),
  ('n8n_visual_map_review', 'n8n Visual Map Review', 'paused', 900000, '{"source":"n8n","purpose":"manter mapa visual operacional sem criar telas independentes no site","admin_can_enable":true}')
on conflict (key) do update set
  name = excluded.name,
  interval_ms = excluded.interval_ms,
  metadata = public.ai_automations.metadata || excluded.metadata,
  updated_at = now();
