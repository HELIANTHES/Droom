# Version Management & System Updates

## Overview

The marketing automation factory is a **living system** that improves over time. This document defines how to:
- Version the factory system itself
- Update client systems safely
- Roll back failed updates
- Migrate data when schemas change
- Test updates before deployment

**Key Principle:** Updates should improve client systems without disrupting active campaigns or losing historical data.

---

## Versioning Strategy

### Three-Tier Versioning

**1. System Version (Factory Level)**
- **What:** The droom/ codebase itself (agents, commands, specs)
- **Format:** Semantic versioning (MAJOR.MINOR.PATCH)
- **Location:** `/droom/VERSION`
- **Example:** `1.2.3`

**2. Client Instance Version**
- **What:** A specific client's deployed system
- **Format:** Semantic versioning + system version it was spawned from
- **Location:** `/clients/{brand-name}/VERSION`
- **Example:** `1.2.3-spawned-from-1.2.0`

**3. Component Version**
- **What:** Individual subsystems (n8n workflows, dashboard, website)
- **Format:** Date-based with incremental counter
- **Location:** Component-specific
- **Example:** `2026-02-03-001`

---

## System Versioning (droom/)

### Version File Format

**Location:** `/droom/VERSION`

```json
{
  "version": "1.2.3",
  "released": "2026-02-03",
  "changelog": "Added e-commerce purchase attribution, improved content profiling",
  "breaking_changes": false,
  "compatible_with": ["1.2.0", "1.2.1", "1.2.2"],
  "requires_migration": false,
  "migration_guide": null
}
```

### Semantic Versioning Rules

**MAJOR version (1.x.x → 2.x.x):**
- Breaking changes to agent interfaces
- Database schema changes requiring migration
- Incompatible changes to system-specs
- Example: Pinecone namespace structure changed

**MINOR version (1.2.x → 1.3.x):**
- New features added (new agents, new workflows)
- Non-breaking enhancements to existing agents
- New optional capabilities
- Example: Added Shopify integration workflow

**PATCH version (1.2.3 → 1.2.4):**
- Bug fixes
- Prompt improvements
- Documentation updates
- Performance optimizations
- Example: Fixed n8n workflow error handling

---

## Client Instance Versioning

### Version File Format

**Location:** `/clients/{brand-name}/VERSION`

```json
{
  "client_version": "1.2.3",
  "spawned_from_system": "1.2.0",
  "spawned_date": "2026-01-15",
  "last_updated": "2026-02-03",
  "update_history": [
    {
      "date": "2026-02-03",
      "from_version": "1.2.0",
      "to_version": "1.2.3",
      "update_type": "patch",
      "applied_by": "orchestrator",
      "status": "success"
    }
  ],
  "active_components": {
    "n8n_workflows": "2026-02-03-001",
    "dashboard": "2026-01-15-001",
    "website": "2026-01-15-001"
  },
  "custom_modifications": []
}
```

### Custom Modifications Tracking

**If a client has custom requirements beyond the standard factory:**

```json
{
  "custom_modifications": [
    {
      "type": "workflow",
      "description": "Added custom SMS notification workflow",
      "created": "2026-01-20",
      "files": [
        "/clients/zen-med-clinic/n8n/workflows/custom-sms-notification.json"
      ],
      "affects_updates": true,
      "notes": "Must preserve during updates"
    }
  ]
}
```

---

## Update Types & Strategies

### Update Type 1: Non-Breaking System Update

**Scenario:** System 1.2.0 → 1.2.3 (patch updates)

**Changes:**
- Improved agent prompts
- Fixed n8n workflow bug
- Better error handling

**Impact:** No breaking changes, safe to apply

**Strategy:** Automatic update (opt-in by client)

**Process:**
```
1. Orchestrator detects new system version available
   ↓
2. Check client compatibility
   Compatible: YES (1.2.3 compatible with 1.2.0)
   ↓
3. Orchestrator invokes Update Agent
   ↓
4. Update Agent creates backup
   Location: /clients/zen-med-clinic/backups/pre-1.2.3/
   ↓
5. Update Agent applies changes:
   - Update agent prompts (in .claude/agents/)
   - Update n8n workflows
   - Update system-knowledge/ docs
   ↓
6. Update Agent runs validation tests
   - Test n8n workflows execute
   - Test dashboard loads
   - Test website accessible
   ↓
7. If tests pass:
   Update VERSION file
   Status: "success"
   ↓
8. If tests fail:
   Rollback to backup
   Status: "failed", notify admin
```

---

### Update Type 2: Feature Addition (Minor Version)

**Scenario:** System 1.2.0 → 1.3.0 (new Shopify integration)

**Changes:**
- New workflow: shopify-integration.json
- New database nodes: Purchase, Customer
- New dashboard section: Purchase Attribution

**Impact:** Additive only, existing functionality unchanged

**Strategy:** Optional update (client chooses to enable)

**Process:**
```
1. Notify client: "New feature available: E-commerce Purchase Attribution"
   ↓
2. Client opts in via dashboard
   ↓
3. Orchestrator invokes Update Agent
   ↓
4. Update Agent checks prerequisites:
   - Does client have e-commerce business model?
   - Is Shopify connected?
   ↓
5. If prerequisites met:
   - Add new n8n workflow
   - Create new database schema (Neo4j)
   - Add dashboard section
   - Update VERSION to 1.3.0
   ↓
6. Run integration tests
   ↓
7. If successful:
   Enable feature
   Provide setup instructions
```

---

### Update Type 3: Breaking Change (Major Version)

**Scenario:** System 1.x.x → 2.0.0 (Pinecone namespace restructure)

**Changes:**
- Pinecone namespaces reorganized
- Different metadata structure
- Requires data migration

**Impact:** Breaking change, requires migration

**Strategy:** Manual migration with data preservation

**Process:**
```
1. STOP all n8n workflows (prevent data inconsistency)
   ↓
2. Create full backup:
   - Pinecone: Export all vectors
   - Neo4j: Create database dump
   - Files: Backup entire client directory
   Location: /clients/zen-med-clinic/backups/pre-2.0.0/
   ↓
3. Run migration script:
   - Read old Pinecone data
   - Transform to new structure
   - Write to new namespaces
   - Validate data integrity
   ↓
4. Update Neo4j schema:
   - Add new node types
   - Migrate existing data
   - Update relationships
   ↓
5. Update all components:
   - n8n workflows (use new namespace structure)
   - Dashboard (query new schema)
   - Agents (updated prompts)
   ↓
6. Run comprehensive test suite:
   - Test content ingestion
   - Test performance analysis
   - Test dashboard queries
   - Test website forms
   ↓
7. If tests pass:
   - Update VERSION to 2.0.0
   - Resume n8n workflows
   - Monitor for 24 hours
   ↓
8. If tests fail:
   - ROLLBACK entire migration
   - Restore from backup
   - Investigate issue
   - Fix and retry
```

---

## Migration Scripts

### Migration Script Structure

**Location:** `/droom/migrations/{version}/migrate.py`

**Example: 1.2.0 → 2.0.0 Pinecone Namespace Migration**

```python
# /droom/migrations/2.0.0/migrate.py

import pinecone
import json
from typing import List, Dict

class Migration_2_0_0:
    """
    Migrate Pinecone namespace structure from 1.x to 2.0
    
    Changes:
    - Old: Single namespace "content-{brand-id}"
    - New: Multiple namespaces by type:
        - "content-essence-{brand-id}"
        - "scenario-outcomes-{brand-id}"
        - "audience-psychographics-{brand-id}"
    """
    
    def __init__(self, brand_id: str, pinecone_api_key: str):
        self.brand_id = brand_id
        pinecone.init(api_key=pinecone_api_key)
        self.index = pinecone.Index("marketing-automation")
    
    def backup_old_data(self) -> List[Dict]:
        """Export all vectors from old namespace"""
        print(f"[1/5] Backing up data from old namespace...")
        
        old_namespace = f"content-{self.brand_id}"
        
        # Fetch all vectors (paginate if needed)
        all_vectors = []
        
        # Query with dummy vector to get all results
        results = self.index.query(
            namespace=old_namespace,
            vector=[0] * 1536,
            top_k=10000,
            include_metadata=True
        )
        
        all_vectors = results.matches
        
        # Save to backup file
        backup_path = f"/clients/{self.brand_id}/backups/pre-2.0.0/pinecone-backup.json"
        with open(backup_path, 'w') as f:
            json.dump([
                {
                    "id": v.id,
                    "values": v.values,
                    "metadata": v.metadata
                } for v in all_vectors
            ], f)
        
        print(f"✓ Backed up {len(all_vectors)} vectors to {backup_path}")
        return all_vectors
    
    def transform_data(self, old_vectors: List[Dict]) -> Dict[str, List[Dict]]:
        """Transform old format to new namespace structure"""
        print(f"[2/5] Transforming data to new structure...")
        
        new_namespaces = {
            f"content-essence-{self.brand_id}": [],
            f"scenario-outcomes-{self.brand_id}": [],
            f"audience-psychographics-{self.brand_id}": []
        }
        
        for vector in old_vectors:
            # Determine which namespace this vector belongs to
            if "content_" in vector["id"]:
                # This is content data → content-essence
                new_namespaces[f"content-essence-{self.brand_id}"].append(vector)
            
            elif "scenario_" in vector["id"]:
                # This is scenario data → scenario-outcomes
                new_namespaces[f"scenario-outcomes-{self.brand_id}"].append(vector)
            
            elif "audience_" in vector["id"]:
                # This is audience data → audience-psychographics
                new_namespaces[f"audience-psychographics-{self.brand_id}"].append(vector)
        
        print(f"✓ Transformed data:")
        for namespace, vectors in new_namespaces.items():
            print(f"  - {namespace}: {len(vectors)} vectors")
        
        return new_namespaces
    
    def write_new_data(self, new_namespaces: Dict[str, List[Dict]]):
        """Write transformed data to new namespaces"""
        print(f"[3/5] Writing data to new namespaces...")
        
        for namespace, vectors in new_namespaces.items():
            if len(vectors) == 0:
                continue
            
            # Upsert in batches of 100
            batch_size = 100
            for i in range(0, len(vectors), batch_size):
                batch = vectors[i:i+batch_size]
                
                self.index.upsert(
                    vectors=[
                        (v["id"], v["values"], v["metadata"]) 
                        for v in batch
                    ],
                    namespace=namespace
                )
            
            print(f"✓ Wrote {len(vectors)} vectors to {namespace}")
    
    def validate_migration(self, old_vectors: List[Dict], new_namespaces: Dict[str, List[Dict]]) -> bool:
        """Validate that all data was migrated correctly"""
        print(f"[4/5] Validating migration...")
        
        # Check total count matches
        old_count = len(old_vectors)
        new_count = sum(len(vectors) for vectors in new_namespaces.values())
        
        if old_count != new_count:
            print(f"✗ Count mismatch: {old_count} old vectors, {new_count} new vectors")
            return False
        
        print(f"✓ Count matches: {old_count} vectors")
        
        # Spot check: Verify 10 random vectors
        import random
        sample_vectors = random.sample(old_vectors, min(10, len(old_vectors)))
        
        for old_vector in sample_vectors:
            # Determine which namespace it should be in
            if "content_" in old_vector["id"]:
                namespace = f"content-essence-{self.brand_id}"
            elif "scenario_" in old_vector["id"]:
                namespace = f"scenario-outcomes-{self.brand_id}"
            else:
                namespace = f"audience-psychographics-{self.brand_id}"
            
            # Fetch from new namespace
            result = self.index.fetch(
                ids=[old_vector["id"]],
                namespace=namespace
            )
            
            if old_vector["id"] not in result.vectors:
                print(f"✗ Vector {old_vector['id']} not found in new namespace")
                return False
            
            new_vector = result.vectors[old_vector["id"]]
            
            # Compare metadata (values would be identical)
            if new_vector.metadata != old_vector["metadata"]:
                print(f"✗ Metadata mismatch for {old_vector['id']}")
                return False
        
        print(f"✓ Spot check passed (verified {len(sample_vectors)} vectors)")
        return True
    
    def cleanup_old_namespace(self):
        """Delete old namespace (only after validation passes)"""
        print(f"[5/5] Cleaning up old namespace...")
        
        old_namespace = f"content-{self.brand_id}"
        
        # Delete all vectors in old namespace
        self.index.delete(delete_all=True, namespace=old_namespace)
        
        print(f"✓ Deleted old namespace: {old_namespace}")
    
    def run(self):
        """Execute full migration"""
        print(f"\n{'='*60}")
        print(f"MIGRATION: 1.x → 2.0.0 (Pinecone Namespace Restructure)")
        print(f"Brand: {self.brand_id}")
        print(f"{'='*60}\n")
        
        try:
            # Step 1: Backup
            old_vectors = self.backup_old_data()
            
            # Step 2: Transform
            new_namespaces = self.transform_data(old_vectors)
            
            # Step 3: Write
            self.write_new_data(new_namespaces)
            
            # Step 4: Validate
            if not self.validate_migration(old_vectors, new_namespaces):
                raise Exception("Validation failed! Aborting cleanup.")
            
            # Step 5: Cleanup
            self.cleanup_old_namespace()
            
            print(f"\n{'='*60}")
            print(f"✓ MIGRATION COMPLETE")
            print(f"{'='*60}\n")
            
            return True
            
        except Exception as e:
            print(f"\n{'='*60}")
            print(f"✗ MIGRATION FAILED")
            print(f"Error: {e}")
            print(f"{'='*60}\n")
            print(f"Backup preserved at: /clients/{self.brand_id}/backups/pre-2.0.0/")
            return False


# CLI usage
if __name__ == "__main__":
    import sys
    
    if len(sys.argv) != 3:
        print("Usage: python migrate.py <brand_id> <pinecone_api_key>")
        sys.exit(1)
    
    brand_id = sys.argv[1]
    api_key = sys.argv[2]
    
    migration = Migration_2_0_0(brand_id, api_key)
    success = migration.run()
    
    sys.exit(0 if success else 1)
```

---

## Rollback Procedures

### Automatic Rollback (Failed Update)

**Trigger:** Update validation tests fail

**Process:**
```python
# In Update Agent

def apply_update(client_path, new_version):
    # Create backup
    backup_path = create_backup(client_path, new_version)
    
    try:
        # Apply changes
        apply_agent_updates(client_path, new_version)
        apply_workflow_updates(client_path, new_version)
        apply_dashboard_updates(client_path, new_version)
        
        # Validate
        if not validate_update(client_path):
            raise Exception("Validation failed")
        
        # Success
        update_version_file(client_path, new_version)
        return {"status": "success"}
        
    except Exception as e:
        # Automatic rollback
        print(f"Update failed: {e}")
        print(f"Rolling back from backup: {backup_path}")
        
        restore_from_backup(client_path, backup_path)
        
        return {
            "status": "failed",
            "error": str(e),
            "rolled_back": True
        }
```

---

### Manual Rollback (Post-Deployment Issue)

**Scenario:** Update deployed successfully but issues discovered later

**Process:**
```
1. User reports issue via dashboard
   ↓
2. Admin investigates, decides to rollback
   ↓
3. Admin runs rollback command:
   /rollback-client brand-name=zen-med-clinic to-version=1.2.0
   ↓
4. Orchestrator invokes Rollback Agent
   ↓
5. Rollback Agent:
   - Stops n8n workflows
   - Identifies backup: /clients/zen-med-clinic/backups/pre-1.2.3/
   - Restores all files from backup
   - Restores databases if schema changed
   - Updates VERSION file to 1.2.0
   - Restarts n8n workflows
   ↓
6. Validate rollback:
   - Test workflows execute
   - Test dashboard accessible
   - Test no data loss
   ↓
7. Report rollback complete
```

---

## Testing Updates Before Deployment

### Test Environment Strategy

**Approach:** Create test clone of client system

**Structure:**
```
/clients/
  ├── zen-med-clinic/           # Production
  └── zen-med-clinic-test/      # Test clone
```

**Test Process:**
```
1. Clone production to test environment:
   /clone-client source=zen-med-clinic dest=zen-med-clinic-test
   ↓
2. Apply update to test environment:
   /update-client brand-name=zen-med-clinic-test to-version=1.2.3
   ↓
3. Run test suite:
   - Workflow execution tests
   - Dashboard functionality tests
   - Website form tests
   - Database query tests
   ↓
4. If tests pass:
   Apply same update to production
   ↓
5. If tests fail:
   Investigate issue in test environment
   Fix update procedure
   Retry
```

---

## Component-Specific Versioning

### n8n Workflow Versioning

**Location:** `/clients/{brand-name}/n8n/workflows/VERSION`

**Format:**
```json
{
  "workflow_version": "2026-02-03-001",
  "workflows": {
    "content-ingestion.json": {
      "version": "2026-02-03-001",
      "last_modified": "2026-02-03T10:30:00Z",
      "changelog": "Added video duration validation"
    },
    "daily-performance.json": {
      "version": "2026-01-15-001",
      "last_modified": "2026-01-15T14:20:00Z",
      "changelog": "Initial version"
    }
  }
}
```

**Update Strategy:**
- Workflows updated independently
- Version increments on each change
- Old versions archived: `/versions/workflow-name/2026-01-15-001.json`

---

### Dashboard Versioning

**Location:** `/clients/{brand-name}/dashboard/VERSION`

**Format:**
```json
{
  "dashboard_version": "2026-01-15-001",
  "frontend_version": "2026-01-15-001",
  "backend_version": "2026-01-15-001",
  "last_deployed": "2026-01-15T16:00:00Z"
}
```

**Update Strategy:**
- Frontend and backend can update independently
- Zero-downtime deployment (blue-green)
- Frontend served from CDN (instant updates)
- Backend uses rolling restart

---

### Website Versioning

**Location:** `/clients/{brand-name}/website/VERSION`

**Format:**
```json
{
  "website_version": "2026-01-15-001",
  "template_base": "service-business-v1",
  "customizations": [
    {
      "file": "components/BookingForm.tsx",
      "modified": "2026-01-20",
      "reason": "Added custom SMS preference field"
    }
  ]
}
```

**Update Strategy:**
- Template updates don't override customizations
- Custom files preserved during updates
- Merge conflicts flagged for manual resolution

---

## Database Schema Versioning

### Neo4j Schema Versioning

**Location:** Stored in Neo4j itself

**Schema Version Node:**
```cypher
CREATE (sv:SchemaVersion {
  version: "2.0.0",
  applied_date: datetime(),
  brand_id: "zen-med-clinic",
  changes: [
    "Added Purchase node type",
    "Added Customer node type",
    "Added ATTRIBUTED_TO relationship"
  ]
})
```

**Migration Pattern:**
```cypher
// Check current schema version
MATCH (sv:SchemaVersion {brand_id: "zen-med-clinic"})
RETURN sv.version

// If version < 2.0.0, run migration
// Add new node types
CREATE CONSTRAINT purchase_id IF NOT EXISTS
FOR (p:Purchase) REQUIRE p.id IS UNIQUE

// Add new relationships (existing nodes unaffected)
MATCH (l:Lead {email: $email})
MATCH (c:Customer {email: $email})
MERGE (l)-[:CONVERTED_TO]->(c)

// Update schema version
CREATE (sv:SchemaVersion {
  version: "2.0.0",
  applied_date: datetime(),
  brand_id: "zen-med-clinic"
})
```

---

### Pinecone Schema Versioning

**Challenge:** Pinecone doesn't support in-place schema changes

**Strategy:** Create new namespaces, migrate data

**Version Tracking:**
```python
# In vector metadata
metadata = {
    "schema_version": "2.0.0",
    # ... rest of metadata
}
```

**Migration:** Use migration script (see earlier example)

---

## Update Communication

### User Notification Strategy

**Before Update:**
```
Subject: System Update Available (1.2.0 → 1.2.3)

Hi [Client Name],

A new system update is available for your marketing automation.

What's New:
- Improved content analysis accuracy
- Better error handling in workflows
- Performance optimizations

Impact:
- No downtime required
- All campaigns continue running
- Takes approximately 10 minutes

Schedule Update:
- Recommended: Tonight at 2 AM (low traffic)
- Or choose your preferred time

[Schedule Update] [Learn More]
```

**During Update:**
```
Dashboard Banner:
"System update in progress (1.2.0 → 1.2.3). Campaigns running normally. Estimated completion: 8 minutes."
```

**After Update:**
```
Subject: System Update Complete ✓

Your system has been successfully updated to version 1.2.3.

What's New:
- [Feature 1]
- [Feature 2]

Everything is running smoothly. No action required.

[View Release Notes]
```

---

## Changelog Maintenance

### Changelog Format

**Location:** `/droom/CHANGELOG.md`

```markdown
# Changelog

## [2.0.0] - 2026-03-01

### Breaking Changes
- ⚠️ Pinecone namespace structure changed
- ⚠️ Requires data migration (see migration guide)

### Added
- E-commerce purchase attribution workflow
- Customer lifetime value tracking
- Advanced audience segmentation

### Changed
- Improved content profiling accuracy (15% better predictions)
- Updated agent prompts for clarity

### Fixed
- Issue #47: Dashboard timeout on large datasets
- Issue #52: n8n workflow error handling

### Migration Guide
See `/droom/migrations/2.0.0/MIGRATION.md`

---

## [1.2.3] - 2026-02-03

### Fixed
- Content ingestion workflow error on video files > 50MB
- Dashboard chart rendering bug in Firefox

### Changed
- Improved CSO Agent budget allocation logic

---

## [1.2.0] - 2026-01-15

### Added
- Initial release of marketing automation factory
- 23 Layer 1 agents for client system building
- 6 Runtime agents for marketing operations
- Complete n8n workflow suite
- Dashboard with 3-level progressive disclosure
- Service business website templates

### Known Issues
- Large video files (>50MB) may timeout during ingestion
- Dashboard charts may render slowly in Firefox
```

---

## Version Compatibility Matrix

**Which client versions can safely update to which system versions?**

| Client Version | Can Update To | Migration Required | Notes |
|----------------|---------------|-------------------|-------|
| 1.0.x | 1.1.x | No | Safe, automatic |
| 1.0.x | 1.2.x | No | Safe, automatic |
| 1.0.x | 2.0.x | Yes | Breaking change, manual migration |
| 1.1.x | 1.2.x | No | Safe, automatic |
| 1.1.x | 2.0.x | Yes | Breaking change, manual migration |
| 1.2.x | 1.3.x | No | Safe, automatic |
| 1.2.x | 2.0.x | Yes | Breaking change, manual migration |

**Rule:** Can always update within same MAJOR version without migration.

---

## Emergency Hotfix Process

### Scenario: Critical Bug in Production

**Example:** n8n workflow causing infinite loop, burning API credits

**Process:**
```
1. IMMEDIATE: Disable affected workflow
   - Stop n8n workflow execution
   - Prevent further damage
   ↓
2. Assess impact:
   - How many clients affected?
   - What's the severity?
   - Can we wait for normal update cycle?
   ↓
3. If critical (can't wait):
   - Create hotfix branch: hotfix/1.2.3.1
   - Fix the bug
   - Test in isolated environment
   - Create patch version: 1.2.3.1
   ↓
4. Deploy hotfix:
   - Update affected clients immediately
   - Skip normal update approval
   - Monitor closely
   ↓
5. Post-mortem:
   - Document root cause
   - Update test suite to catch similar bugs
   - Merge hotfix into main branch
```

---

## Deprecation Policy

### Deprecating Features

**Process:**
```
Version 1.5.0: Announce deprecation
- "Feature X is deprecated and will be removed in 2.0.0"
- Provide migration path
- Update documentation

Version 1.6.0 - 1.9.0: Maintain feature but show warnings
- Feature still works
- Dashboard shows deprecation warning
- Encourage migration to new approach

Version 2.0.0: Remove feature
- Feature no longer available
- Migration must be complete
```

**Example:**
```
Version 1.5.0:
"The 'simple-lead-scoring' workflow is deprecated. 
Please migrate to the new 'ai-lead-scoring' workflow which uses Claude API.
Simple lead scoring will be removed in version 2.0.0."

Version 2.0.0:
Removed: simple-lead-scoring.json
All clients must use ai-lead-scoring.json
```

---

## Best Practices Summary

### Do:
✅ Always create backups before updates
✅ Version everything (system, clients, components)
✅ Test updates in test environment first
✅ Provide clear changelogs
✅ Communicate with clients before/during/after updates
✅ Use semantic versioning consistently
✅ Preserve custom modifications during updates
✅ Implement automatic rollback on failed updates
✅ Track migration history

### Don't:
❌ Update production without testing
❌ Skip backups ("it's just a small change")
❌ Force breaking changes without migration guide
❌ Delete old backups too quickly (keep 30 days minimum)
❌ Update multiple components simultaneously (update incrementally)
❌ Ignore version compatibility
❌ Deploy on Friday afternoon (no weekend support)
❌ Update during high-traffic hours

---

## Monitoring Update Success

### Metrics to Track

**Update Success Rate:**
```python
update_metrics = {
    "total_updates": 127,
    "successful": 123,
    "failed": 3,
    "rolled_back": 1,
    "success_rate": 0.969
}
```

**Update Duration:**
- Target: < 15 minutes for patch updates
- Track: Average, median, p95, p99

**Post-Update Error Rate:**
- Monitor error rate for 24 hours after update
- Alert if error rate > 2x baseline

**Client Satisfaction:**
- Survey clients after major updates
- Track feedback sentiment
