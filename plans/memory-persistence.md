# Plano de Persistência de Memória para IAs

## Visão Geral
Implementar um mecanismo que permita que cada instância da IA, iniciada via extensão *Antigravity* no *Open Code*, mantenha seu histórico de conversas entre sessões, usando arquivos JSON por sessão.

## Estrutura de Diretórios
```
c:/Users/Administrador/YGGNAROK/
│
├─ memory/                 # Pasta onde serão armazenados os arquivos de memória
│   └─ session_<id>.json   # Um arquivo por sessão/terminal
│
├─ scripts/                # Scripts auxiliares
│   └─ run-ia.ps1          # Wrapper PowerShell que gerencia a memória
│
└─ plans/
    └─ memory-persistence.md   # Este documento de planejamento
```

## Estratégia de Persistência
1. **Identificador de sessão**  
   - Gerado automaticamente ao iniciar o wrapper (`run-ia.ps1`).  
   - Formato: `session_YYYYMMDD_HHMMSS_<random>`.

2. **Formato do arquivo de memória** (`JSON`)  
   ```json
   {
     "sessionId": "session_20240601_183000_1234",
     "createdAt": "2026-06-01T18:30:00.000Z",
     "messages": [
       {"role":"user","content":"..."},
       {"role":"assistant","content":"..."}
     ]
   }
   ```

3. **Fluxo de execução do wrapper**  
   - **Start**: verifica se já existe `memory/<sessionId>.json`.  
   - **Load**: se existir, carrega o array `messages` e o envia ao iniciar a IA (via parâmetro da extensão).  
   - **Run**: inicia a IA usando o comando da extensão *Antigravity* (`antigravity start-ia --session <sessionId> --history <json>`).  
   - **Update**: a cada resposta da IA, o wrapper adiciona a mensagem ao arquivo JSON, garantindo persistência imediata.  
   - **Close**: ao encerrar o terminal, o arquivo permanece salvo para futuras retomadas.

4. **Isolamento entre terminais**  
   - Cada terminal recebe seu próprio `sessionId`, portanto cada um tem um arquivo distinto em `memory/`.  
   - Não há risco de mistura de históricos.

## Próximas Etapas (a serem executadas no modo **Code**)

| Etapa | Descrição | Arquivo |
|------|-----------|---------|
| 1 | Criar diretório `memory/` (se ainda não existir) | — |
| 2 | Implementar script PowerShell `run-ia.ps1` com lógica de geração de `sessionId`, leitura/escrita de JSON e chamada à extensão *Antigravity* | `scripts/run-ia.ps1` |
| 3 | Ajustar a extensão *Antigravity* (se necessário) para aceitar parâmetro `--history` contendo JSON de mensagens | — |
| 4 | Testar em 5 terminais simultâneos, verificando que cada um mantém seu próprio histórico | — |
| 5 | Documentar uso no `README.md` (localização dos arquivos, como iniciar, como retomar sessão) | `README.md` |

## Considerações Técnicas
- **PowerShell** foi escolhido porque o modo *Architect* permite apenas edição de arquivos `.md`. O script foi criado no modo *Code*.
- O formato JSON garante compatibilidade com a maioria das APIs de LLMs que aceitam histórico de mensagens.
- O wrapper pode ser invocado como:  
  ```powershell
  .\scripts\run-ia.ps1   # gera nova sessão
  .\scripts\run-ia.ps1 -sessionId session_20240601_183000_1234   # retoma sessão existente
  ```

## Riscos & Mitigações
- **Limite de tamanho do arquivo**: se o histórico crescer muito, o wrapper pode truncar mensagens antigas (policy de retenção).  
- **Conflitos de escrita simultânea**: cada terminal usa seu próprio arquivo, evitando colisões.  
- **Dependência da extensão**: caso a extensão *Antigravity* não suporte passagem de histórico, será necessário um pequeno adaptador (a ser desenvolvido).

---

*Próximo passo*: mudar para o modo **Code** e criar o script `run-ia.ps1` conforme descrito.