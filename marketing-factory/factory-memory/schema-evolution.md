# Factory Memory: Schema Evolution

<schema_evolution>
<!-- Database schema changes made post-build that should be incorporated into future initial builds. -->
<!-- Format: {date} [{client}] What was added/changed. Why. Should this be default for new clients? -->

<!-- This file is empty until the first client build. The database-schema agent should consult -->
<!-- this before designing schemas for new clients, and write to it when post-build schema -->
<!-- changes reveal gaps in the initial design. -->

<!-- Example entries (to be replaced with real learnings): -->
<!-- 2026-03-15 [zen-med-clinic] Added AppointmentSlot nodes linked to Leads for service businesses. Enables tracking from ad click → lead → booked appointment → completed visit. Should be default for brick-and-mortar. -->
<!-- 2026-04-02 [artisan-jewels] Added ProductCategory nodes in Neo4j to complement Shopify categories. Enables cross-referencing ad performance by product category. Should be default for ecommerce. -->
</schema_evolution>
