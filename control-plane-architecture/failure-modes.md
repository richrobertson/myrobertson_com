# Control Plane Failure Modes

Failure analysis here is grounded in the Multitenant Control Plane Workflow Platform reference implementation.

## Applied Example (Multitenant Control Plane Platform)

### Theory -> platform behavior

- **Partial propagation** becomes version skew between data-plane nodes when event fanout lags.
- **Stale decisioning** appears when workflow engine evaluates policy against an outdated snapshot.
- **Blast radius expansion** occurs when tenant isolation is weak and one tenant consumes shared decision capacity.
- **Overload collapse** appears as queue age growth in API and workflow decision partitions.

### How the real system handles this

- Enforce monotonic apply per `(tenant_id, resource_key)` to detect and reject out-of-order updates.
- Track per-tenant lag SLOs and trigger snapshot replay when skew exceeds threshold.
- Apply per-tenant admission + concurrency caps before shared pools saturate.
- Degrade non-critical propagation classes first to preserve critical decision channels.

### Component -> failure mode -> tradeoff

- **Event propagation system** -> partial propagation -> lower coupling but eventual consistency complexity.
- **Workflow engine** -> stale decisioning -> high throughput but strict snapshot/version discipline required.
- **Tenant isolation layer** -> blast-radius containment -> stronger safety with reduced global efficiency.
