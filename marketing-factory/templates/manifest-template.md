# System Manifest: {client-name}

<system_state>
<!-- Current deployment status of each component. Update whenever a component is built, deployed, or modified. -->
<!-- Format: component | status | location | version/notes -->

| Component | Status | Location | Notes |
|-----------|--------|----------|-------|
| brand-config.json | created | clients/{name}/brand-config.json | Master configuration |
| research | complete | clients/{name}/research/ | Brand profile + competitive landscape |
| strategy | complete | clients/{name}/strategy/ | Campaign plan |
| creative | complete | clients/{name}/creative/ | Strategy + briefs |
| content-requests | complete | clients/{name}/content-requests/ | Shot lists, filming guide, copy |
| database | {initialized/pending} | Neo4j Aura + Pinecone | Schema version: {version} |
| n8n workflows | {built/deployed/pending} | {location} | {N} workflows |
| runtime prompts | complete | clients/{name}/automation/prompts/ | 6 agent prompts |
| dashboard | {built/deployed/pending} | {location} | Frontend + backend |
| website | {built/deployed/pending} | {location} | {type: service/ecommerce} |
| integration | complete | clients/{name}/integration/ | Configs + test suite |
</system_state>

---

<configuration>
<!-- Key configuration values from brand-config.json for quick reference. -->
brand_id: {brand-id}
brand_name: {Brand Name}
business_model: {model}
industry: {industry}
platforms: {list}
primary_kpi: {kpi}
monthly_budget: {amount}
</configuration>

---

<change_log>
<!-- Chronological record of all changes. Every agent or manual modification should be logged here. -->
<!-- Format: {date} [{agent-name|manual}] What changed. Why. Impact on other components (if any). -->
</change_log>

---

<dependency_map>
<!-- Which artifacts are consumed by which components. Use this to assess impact of changes. -->

**brand-config.json** → read by: all agents, n8n workflow variables, dashboard config, website config
**database schema** → used by: n8n workflows (Cypher queries), dashboard backend (API queries)
**n8n webhook URLs** → used by: website form handlers, dashboard webhook receivers
**runtime prompts** → used by: n8n Claude API nodes (workflows 2, 3, 4, 5, 6, 7)
**creative strategy** → referenced by: n8n content ingestion (profiling attributes), runtime agents (brand context)
**research outputs** → referenced by: strategy, creative, proposal generation
</dependency_map>

---

<known_issues>
<!-- Current problems, limitations, or technical debt. -->
<!-- Format: {date} Issue description. Severity: {low|medium|high}. Workaround (if any). -->
</known_issues>
