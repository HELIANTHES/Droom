"""
Neo4j Database Initialization for Eastern Healing Traditions
Droom Marketing Factory

Creates constraints, indexes, shared attribute nodes, and client-specific
seed data. Safe to run multiple times (idempotent). Never modifies or
deletes data outside the :Droom label scope.

Usage:
    python init_neo4j.py

Requires:
    pip install neo4j python-dotenv

Environment variables (loaded from ../../.env or set directly):
    NEO4J_URI, NEO4J_USER, NEO4J_PASSWORD
"""

import os
import sys
from pathlib import Path

from dotenv import load_dotenv
from neo4j import GraphDatabase
from neo4j.exceptions import ServiceUnavailable, AuthError

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

BRAND_ID = "eastern-healing-traditions"
BRAND_NAME = "Eastern Healing Traditions"
BUSINESS_MODEL = "brick-and-mortar-primary"

# Load .env from two levels up (marketing-factory root)
_script_dir = Path(__file__).resolve().parent
_env_path = _script_dir / ".." / ".." / ".." / ".env"
load_dotenv(dotenv_path=_env_path)

NEO4J_URI = os.environ.get("NEO4J_URI")
NEO4J_USER = os.environ.get("NEO4J_USER")
NEO4J_PASSWORD = os.environ.get("NEO4J_PASSWORD")

if not all([NEO4J_URI, NEO4J_USER, NEO4J_PASSWORD]):
    print("ERROR: Missing required environment variables.")
    print("  Set NEO4J_URI, NEO4J_USER, NEO4J_PASSWORD in your environment")
    print(f"  or in {_env_path}")
    sys.exit(1)

# ---------------------------------------------------------------------------
# Schema definitions
# ---------------------------------------------------------------------------

# Constraints — unique id+brand_id for brand-specific nodes.
# Note: Neo4j Community Edition does not support node-key constraints on
# composite keys. We create unique constraints on `id` scoped to the label.
# Brand-level isolation is enforced at the application/query layer.
CONSTRAINTS = [
    (
        "droom_content_id_unique",
        "CREATE CONSTRAINT droom_content_id_unique IF NOT EXISTS "
        "FOR (n:Droom:Content) REQUIRE n.id IS UNIQUE"
    ),
    (
        "droom_campaign_id_unique",
        "CREATE CONSTRAINT droom_campaign_id_unique IF NOT EXISTS "
        "FOR (n:Droom:Campaign) REQUIRE n.id IS UNIQUE"
    ),
    (
        "droom_lead_id_unique",
        "CREATE CONSTRAINT droom_lead_id_unique IF NOT EXISTS "
        "FOR (n:Droom:Lead) REQUIRE n.id IS UNIQUE"
    ),
    (
        "droom_performance_id_unique",
        "CREATE CONSTRAINT droom_performance_id_unique IF NOT EXISTS "
        "FOR (n:Droom:Performance) REQUIRE n.id IS UNIQUE"
    ),
    (
        "droom_websiteform_id_unique",
        "CREATE CONSTRAINT droom_websiteform_id_unique IF NOT EXISTS "
        "FOR (n:Droom:WebsiteForm) REQUIRE n.id IS UNIQUE"
    ),
    (
        "droom_demographic_id_unique",
        "CREATE CONSTRAINT droom_demographic_id_unique IF NOT EXISTS "
        "FOR (n:Droom:Demographic) REQUIRE n.id IS UNIQUE"
    ),
    (
        "droom_geographic_id_unique",
        "CREATE CONSTRAINT droom_geographic_id_unique IF NOT EXISTS "
        "FOR (n:Droom:Geographic) REQUIRE n.id IS UNIQUE"
    ),
]

# Indexes for efficient querying.
INDEXES = [
    (
        "droom_content_brand_id",
        "CREATE INDEX droom_content_brand_id IF NOT EXISTS "
        "FOR (n:Droom:Content) ON (n.brand_id)"
    ),
    (
        "droom_content_status",
        "CREATE INDEX droom_content_status IF NOT EXISTS "
        "FOR (n:Droom:Content) ON (n.status)"
    ),
    (
        "droom_campaign_brand_id",
        "CREATE INDEX droom_campaign_brand_id IF NOT EXISTS "
        "FOR (n:Droom:Campaign) ON (n.brand_id)"
    ),
    (
        "droom_campaign_status",
        "CREATE INDEX droom_campaign_status IF NOT EXISTS "
        "FOR (n:Droom:Campaign) ON (n.status)"
    ),
    (
        "droom_performance_date",
        "CREATE INDEX droom_performance_date IF NOT EXISTS "
        "FOR (n:Droom:Performance) ON (n.date)"
    ),
    (
        "droom_performance_brand_id",
        "CREATE INDEX droom_performance_brand_id IF NOT EXISTS "
        "FOR (n:Droom:Performance) ON (n.brand_id)"
    ),
    (
        "droom_lead_brand_id",
        "CREATE INDEX droom_lead_brand_id IF NOT EXISTS "
        "FOR (n:Droom:Lead) ON (n.brand_id)"
    ),
    (
        "droom_lead_email",
        "CREATE INDEX droom_lead_email IF NOT EXISTS "
        "FOR (n:Droom:Lead) ON (n.email)"
    ),
    (
        "droom_lead_status",
        "CREATE INDEX droom_lead_status IF NOT EXISTS "
        "FOR (n:Droom:Lead) ON (n.status)"
    ),
    (
        "droom_websiteform_brand_id",
        "CREATE INDEX droom_websiteform_brand_id IF NOT EXISTS "
        "FOR (n:Droom:WebsiteForm) ON (n.brand_id)"
    ),
    (
        "droom_demographic_brand_id",
        "CREATE INDEX droom_demographic_brand_id IF NOT EXISTS "
        "FOR (n:Droom:Demographic) ON (n.brand_id)"
    ),
    (
        "droom_geographic_brand_id",
        "CREATE INDEX droom_geographic_brand_id IF NOT EXISTS "
        "FOR (n:Droom:Geographic) ON (n.brand_id)"
    ),
]

# Shared attribute nodes — universal across all Droom clients.
# These use MERGE so they are created only once, even if multiple clients
# run their init scripts.
SHARED_ATTRIBUTES = {
    "Tone": [
        "calm", "professional", "energetic", "playful",
        "aspirational", "reassuring", "urgent", "educational",
    ],
    "Aesthetic": [
        "minimal", "luxurious", "intimate", "modern",
        "rustic", "vibrant", "clean", "warm",
    ],
    "ColorPalette": [
        "warm-tones", "cool-tones", "earth-tones",
        "vibrant", "pastel", "monochrome",
    ],
    "Composition": [
        "close-up", "medium-shot", "wide-shot", "establishing",
    ],
    "NarrativeElement": [
        "shows_physical_space", "shows_people", "shows_product_service",
        "demonstrates_use", "has_dialogue", "has_text_overlay",
    ],
    "Platform": [
        "instagram", "facebook", "google-search", "youtube",
    ],
    "TimeSlot": [
        "early-morning", "morning", "midday",
        "afternoon", "evening", "late-night",
    ],
}

# Client-specific demographic segments.
DEMOGRAPHICS = [
    {
        "id": f"{BRAND_ID}--chronic-pain-seekers-40-65",
        "brand_id": BRAND_ID,
        "name": "chronic-pain-seekers-40-65",
        "display_name": "Pain Relief Seekers",
        "age_range": "40-65",
        "gender": "all",
        "description": (
            "Established adults managing chronic pain conditions. "
            "Middle-to-upper income ($75K-150K). Research-heavy purchase "
            "journey — searches conditions, reads reviews, needs trust "
            "signals before booking."
        ),
    },
    {
        "id": f"{BRAND_ID}--autoimmune-wellness-women-30-55",
        "brand_id": BRAND_ID,
        "name": "autoimmune-wellness-women-30-55",
        "display_name": "Autoimmune Warriors",
        "age_range": "30-55",
        "gender": "female-skew",
        "description": (
            "Women managing ongoing autoimmune conditions, balancing health "
            "with career and family. Middle-to-upper income ($65K-130K). "
            "Community-influenced — trusts recommendations from support "
            "groups and fellow patients."
        ),
    },
    {
        "id": f"{BRAND_ID}--proactive-wellness-adults-28-50",
        "brand_id": BRAND_ID,
        "name": "proactive-wellness-adults-28-50",
        "display_name": "Wellness Optimizers",
        "age_range": "28-50",
        "gender": "all",
        "description": (
            "Health-conscious adults interested in preventative care and "
            "optimization. Upper-middle income ($90K-200K). Education-first "
            "purchase journey — wants to understand TCM before committing."
        ),
    },
]

# Client-specific geographic zones.
GEOGRAPHIC_ZONES = [
    {
        "id": f"{BRAND_ID}--core",
        "brand_id": BRAND_ID,
        "name": "core",
        "radius_miles": 10,
        "budget_weight": 0.50,
        "center_lat": 42.3447,
        "center_lng": -87.9967,
        "center_address": "34121 US-45, Grayslake, IL 60030",
        "areas": "Grayslake, Round Lake, Mundelein, Libertyville, Gurnee, Waukegan",
    },
    {
        "id": f"{BRAND_ID}--extended",
        "brand_id": BRAND_ID,
        "name": "extended",
        "radius_miles": 20,
        "budget_weight": 0.35,
        "center_lat": 42.3447,
        "center_lng": -87.9967,
        "center_address": "34121 US-45, Grayslake, IL 60030",
        "areas": "Vernon Hills, Lake Forest, Highland Park, Antioch, Crystal Lake, McHenry",
    },
    {
        "id": f"{BRAND_ID}--metro",
        "brand_id": BRAND_ID,
        "name": "metro",
        "radius_miles": 35,
        "budget_weight": 0.15,
        "center_lat": 42.3447,
        "center_lng": -87.9967,
        "center_address": "34121 US-45, Grayslake, IL 60030",
        "areas": "Northern Chicago suburbs, Evanston, Schaumburg, Elgin",
    },
]

# ---------------------------------------------------------------------------
# Execution
# ---------------------------------------------------------------------------


def run_queries(driver):
    """Execute all schema and seed data queries."""
    summary = {
        "constraints_created": 0,
        "indexes_created": 0,
        "shared_attribute_nodes": 0,
        "demographic_nodes": 0,
        "geographic_nodes": 0,
        "errors": [],
    }

    # --- Constraints ---
    print("\n--- Creating constraints (IF NOT EXISTS) ---")
    with driver.session() as session:
        for name, cypher in CONSTRAINTS:
            try:
                session.run(cypher)
                summary["constraints_created"] += 1
                print(f"  [OK] {name}")
            except Exception as e:
                msg = f"  [FAIL] {name}: {e}"
                print(msg)
                summary["errors"].append(msg)

    # --- Indexes ---
    print("\n--- Creating indexes (IF NOT EXISTS) ---")
    with driver.session() as session:
        for name, cypher in INDEXES:
            try:
                session.run(cypher)
                summary["indexes_created"] += 1
                print(f"  [OK] {name}")
            except Exception as e:
                msg = f"  [FAIL] {name}: {e}"
                print(msg)
                summary["errors"].append(msg)

    # --- Shared attribute nodes ---
    print("\n--- Merging shared attribute nodes ---")
    with driver.session() as session:
        for label, values in SHARED_ATTRIBUTES.items():
            for value in values:
                try:
                    cypher = (
                        f"MERGE (n:Droom:{label} {{name: $name}}) "
                        f"ON CREATE SET n.created_at = datetime()"
                    )
                    session.run(cypher, name=value)
                    summary["shared_attribute_nodes"] += 1
                    print(f"  [OK] :Droom:{label} {{name: '{value}'}}")
                except Exception as e:
                    msg = f"  [FAIL] :Droom:{label} {{name: '{value}'}}: {e}"
                    print(msg)
                    summary["errors"].append(msg)

    # --- Client-specific demographic nodes ---
    print("\n--- Merging demographic nodes ---")
    with driver.session() as session:
        for demo in DEMOGRAPHICS:
            try:
                cypher = (
                    "MERGE (n:Droom:Demographic {id: $id}) "
                    "ON CREATE SET "
                    "  n.brand_id = $brand_id, "
                    "  n.name = $name, "
                    "  n.display_name = $display_name, "
                    "  n.age_range = $age_range, "
                    "  n.gender = $gender, "
                    "  n.description = $description, "
                    "  n.created_at = datetime() "
                    "ON MATCH SET "
                    "  n.display_name = $display_name, "
                    "  n.age_range = $age_range, "
                    "  n.gender = $gender, "
                    "  n.description = $description"
                )
                session.run(cypher, **demo)
                summary["demographic_nodes"] += 1
                print(f"  [OK] :Droom:Demographic {{name: '{demo['name']}'}}")
            except Exception as e:
                msg = f"  [FAIL] :Droom:Demographic {{name: '{demo['name']}'}}: {e}"
                print(msg)
                summary["errors"].append(msg)

    # --- Client-specific geographic nodes ---
    print("\n--- Merging geographic nodes ---")
    with driver.session() as session:
        for geo in GEOGRAPHIC_ZONES:
            try:
                cypher = (
                    "MERGE (n:Droom:Geographic {id: $id}) "
                    "ON CREATE SET "
                    "  n.brand_id = $brand_id, "
                    "  n.name = $name, "
                    "  n.radius_miles = $radius_miles, "
                    "  n.budget_weight = $budget_weight, "
                    "  n.center_lat = $center_lat, "
                    "  n.center_lng = $center_lng, "
                    "  n.center_address = $center_address, "
                    "  n.areas = $areas, "
                    "  n.created_at = datetime() "
                    "ON MATCH SET "
                    "  n.radius_miles = $radius_miles, "
                    "  n.budget_weight = $budget_weight, "
                    "  n.areas = $areas"
                )
                session.run(cypher, **geo)
                summary["geographic_nodes"] += 1
                print(f"  [OK] :Droom:Geographic {{name: '{geo['name']}'}}")
            except Exception as e:
                msg = f"  [FAIL] :Droom:Geographic {{name: '{geo['name']}'}}: {e}"
                print(msg)
                summary["errors"].append(msg)

    return summary


def main():
    print("=" * 64)
    print("Droom Marketing Factory - Neo4j Schema Initialization")
    print(f"Client: {BRAND_NAME} ({BRAND_ID})")
    print(f"Business model: {BUSINESS_MODEL}")
    print(f"  -> Lead/WebsiteForm nodes: ENABLED")
    print(f"  -> Customer/Purchase nodes: SKIPPED (not e-commerce)")
    print(f"Target: {NEO4J_URI}")
    print("=" * 64)

    try:
        driver = GraphDatabase.driver(NEO4J_URI, auth=(NEO4J_USER, NEO4J_PASSWORD))
        driver.verify_connectivity()
        print("\nConnected to Neo4j successfully.")
    except AuthError:
        print("\nERROR: Authentication failed. Check NEO4J_USER and NEO4J_PASSWORD.")
        sys.exit(1)
    except ServiceUnavailable:
        print(f"\nERROR: Cannot reach Neo4j at {NEO4J_URI}.")
        print("  Check that the instance is running and the URI is correct.")
        sys.exit(1)
    except Exception as e:
        print(f"\nERROR: Failed to connect to Neo4j: {e}")
        sys.exit(1)

    try:
        summary = run_queries(driver)
    finally:
        driver.close()

    # --- Print summary ---
    print("\n" + "=" * 64)
    print("INITIALIZATION SUMMARY")
    print("=" * 64)
    print(f"  Constraints created/verified: {summary['constraints_created']}")
    print(f"  Indexes created/verified:     {summary['indexes_created']}")
    print(f"  Shared attribute nodes:       {summary['shared_attribute_nodes']}")
    print(f"  Demographic nodes:            {summary['demographic_nodes']}")
    print(f"  Geographic nodes:             {summary['geographic_nodes']}")

    if summary["errors"]:
        print(f"\n  ERRORS ({len(summary['errors'])}):")
        for err in summary["errors"]:
            print(f"    {err}")
        sys.exit(1)
    else:
        print("\n  All operations completed successfully.")
        print("  The schema is ready for content ingestion.")


if __name__ == "__main__":
    main()
