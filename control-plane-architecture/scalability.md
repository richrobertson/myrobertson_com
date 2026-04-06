# Control Plane Scalability

Scalability here means maintaining decision correctness under multitenant concurrency, not just increasing QPS.

## Applied Example (Multitenant Control Plane Platform)

### Theory -> platform behavior

- **Horizontal scaling of decision layer:** API and workflow workers scale independently with deterministic state transitions.
- **Tenant partitioning:** scheduling and decision queues are segmented by tenant to bound contention.
- **Fanout control:** propagation throughput is paced by subscriber lag and priority class.

### How the real system handles this

- Partition key: `(tenant_id, workflow_partition)` to isolate hotspots.
- Adaptive worker concurrency based on queue age and decision latency SLOs.
- Propagation channels prioritize safety-critical updates over bulk background sync.

### Component -> failure mode -> tradeoff

- **Workflow engine shards** -> hotspot risk on large tenants -> simple routing vs need for secondary partition key.
- **Tenant partitions** -> uneven utilization -> better isolation vs lower bin-packing efficiency.
- **Fanout scheduler** -> lag under burst config change -> bounded overload vs slower low-priority convergence.
