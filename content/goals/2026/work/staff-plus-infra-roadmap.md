---
type: "goal"
status: "active"
goal-type: "milestone"
priority: "high"
area: "work"
target-date: "2026-09-30T00:00:00.000Z"
current-month: 1
tags: [goal, work, career, infra, staff-plus]
created: "2026-03-20T00:00"
modified: "2026-03-20T00:00"
---

# Staff+ infra prep roadmap (6 months)

**Target:** Staff+ Infra Engineer — Data Platform track
**Timeline:** Mar → Sep 2026
**Context:** Sole engineer at Iterative VC + Fracxional in parallel. Budget: 6–8 hrs/week.
**Related:** [[iterative-l5]]

---

## Skill radar

---

## Month 1 — Mar 2026

**Infra primitives**
- [ ] Terraform basics + DO provider — scaffold data stack as IaC
- [ ] K8s concepts: pods, deployments, services, namespaces

**Observability**
- [ ] OTel instrumentation on existing app

**Data platform**
- [ ] `dbt` on Postgres — model Iterative deal flow data, tests, lineage

**Career signal**
- [ ] Outline blog post: data infra design decisions at a VC

---

## Month 2 — Apr 2026

**Infra primitives**
- [ ] Terraform remote state (DO Spaces), workspaces, multi-env
- [ ] K8s hands-on: minikube or k3s, deploy something real

**Observability**
- [ ] Grafana + Prometheus setup on DO/K8s

**Data platform**
- [ ] Data quality: dbt tests + Great Expectations

**Career signal**
- [ ] IaC repo live on GitHub with clean README

---

### ✅ M2 checkpoint
- [ ] Terraform managing at least one real DO resource
- [ ] Can deploy + debug a pod on local K8s
- [ ] dbt models running against Iterative Postgres
- [ ] OTel sending traces somewhere

---

## Month 3 — May 2026

**Infra primitives**
- [ ] Terraform module design + CI plan/apply via GitHub Actions
- [ ] K8s ops: resource limits, HPA, debugging crashloops

**Observability**
- [ ] SLOs + error budgets for data pipelines

**Data platform**
- [ ] PySpark: execution model, DAGs, stages, shuffle tuning

**Career signal**
- [ ] Write first RFC / design doc

---

## Month 4 — Jun 2026

**Infra primitives**
- [ ] Policy as code: checkov + OPA in CI
- [ ] Deploy data stack on K8s — replace Coolify for one service

**Observability**
- [ ] Alerting philosophy + on-call runbook for Iterative

**Data platform**
- [ ] Delta Lake: concepts, time travel, ACID vs Parquet

**Career signal**
- [ ] Publish post + SEA community presence (Engineers.SG etc.)

---

### ✅ M4 checkpoint
- [ ] Full IaC repo: remote state, staging/prod, CI pipeline
- [ ] One real service on K8s (not Coolify)
- [ ] SLOs dashboarded for at least one pipeline
- [ ] First RFC or design doc written

---

## Month 5 — Jul 2026

**Infra primitives**
- [ ] AWS free tier rebuild OR Pulumi rewrite of one module
- [ ] Secrets: Vault or SOPS + External Secrets Operator

**Observability**
- [ ] Own full telemetry layer end-to-end

**Data platform**
- [ ] Design full platform doc: ingest → transform → serve → observe

**Career signal**
- [ ] Draft Staff+ narrative + target company list

---

## Month 6 — Aug/Sep 2026

**Infra primitives**
- [ ] IaC design doc / ADR for Iterative infra
- [ ] K8s incident simulation + runbook

**Career signal**
- [ ] Start interviewing — system design prep

---

### ✅ M6 checkpoint
- [ ] Can answer all interview questions with lived experience
- [ ] At least one technical post published
- [ ] Target company list with warm intro or application in flight
- [ ] Staff+ narrative drafted and rehearsed

---

## Narrative (refine monthly)

> **Prompt:** What's sharper now? What proof point can you add? What no longer fits?

**Mar 2026:**
> "I've been the sole engineer at a Southeast Asia VC, owning the entire data infrastructure from ingestion to BI and building internal tooling that multiplies the team's capacity. I'm now going deep on the platform and reliability layers I haven't owned formally: IaC, K8s, and observability. My goal is to bring the same systems-thinking I've applied at the product level to the infrastructure level at a data-heavy company."

**Apr 2026:**
>

**May 2026:**
>

**Jun 2026:**
>

**Jul 2026:**
>

**Aug 2026:**
>

---

## Hours log

| Week | Hours | Tracks worked |
|---|---|---|
| 2026-W12 | | |

**Running total:** 0 / ~208 hrs (6 months × ~6.5 avg)

---

## Log

### 2026-03-20
- Roadmap drafted

---

## Reference

### Target companies

| Company | Why | Notes |
|---|---|---|
| Grab | Data platform at scale | Hard bar, worth targeting |
| Sea / Shopee | Massive data infra | SG HQ advantage |
| Funding Societies | Fintech data, Series C+ | Builder-investor angle fits |
| Carro | Automotive data, SEA expansion | |
| Ninja Van | Logistics data platform | |
| Stripe SG | Payments infra, eng excellence | Target at M6 |

### Reading list

- [ ] **Designing Data-Intensive Applications** — Kleppmann, ch. 10–12
- [ ] **Google SRE Book** — ch. 4–6 (SLOs, toil, monitoring). Free online.
- [ ] **Terraform: Up & Running** — Brikman. Read alongside building.
- [ ] **dbt documentation** — just read it top to bottom.
- [ ] **The Delta Lake paper** — 30 min, gives you the vocabulary.
- [ ] **Brendan Gregg's USE Method** — one page, memorise for observability interviews.

### Interview questions to prep

- [ ] Terraform multi-env structure
- [ ] Terraform state in a team setting
- [ ] Recovering from a bad `terraform apply` in prod
- [ ] Secrets management in IaC
- [ ] Design a data platform for 10M DAU from scratch
- [ ] Define SLOs for a data pipeline
- [ ] Alerting philosophy — how to avoid alert fatigue
- [ ] Migrate a team from no IaC to full IaC without breaking prod

### Stack: now vs target

| Layer | Now | Target (Sep 2026) |
|---|---|---|
| Hosting | DigitalOcean + Coolify | DO + K8s (Coolify replaced for ≥1 service) |
| IaC | None (UI-driven) | Terraform — remote state, staging/prod, CI pipeline |
| Ingestion | Airbyte | Airbyte (unchanged, but IaC-managed) |
| Storage | Postgres | Postgres (unchanged, dbt layer on top) |
| Orchestration | n8n + Pipedream | n8n (Pipedream consolidated) |
| Transformation | None (raw SQL) | dbt — models, tests, lineage |
| CI/CD | GitHub Actions (basic) | GitHub Actions — tf plan/apply, checkov, OPA |
| Observability | None | OTel + Grafana + Prometheus, SLOs for pipelines |
| Secrets | .env / manual | SOPS or Vault + External Secrets Operator |

### Pivot signals

- Companies asking for ML/model training background → Data Platform is right, MLOps is not
- No IaC/K8s traction after M2 → reduce scope, Terraform only, defer K8s
- Fracxional load expanding significantly → compress to 2 tracks (IaC + dbt)
- Iterative L5 promo delayed past Sep → reassess whether external Staff+ move is premature

### Notes

- Data Platform track, not MLOps — better SEA market fit
- Coolify abstracts primitives — go underneath deliberately
- Platform/DevEx + Data infra are moat strengths — lead with these in interviews
- Writing = 40% of Staff+ signal — start M1, not M4
- Draft the narrative early, refine monthly under zero pressure
