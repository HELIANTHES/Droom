"""
Pinecone Index Verification for Eastern Healing Traditions
Droom Marketing Factory

Verifies that the shared Pinecone index exists with correct dimensions
and documents the namespaces that will be used by this client. Does NOT
create namespaces — Pinecone creates them implicitly on first upsert.

Usage:
    python init_pinecone.py

Requires:
    pip install pinecone-client python-dotenv

Environment variables (loaded from ../../.env or set directly):
    PINECONE_API_KEY
"""

import os
import sys
from pathlib import Path

from dotenv import load_dotenv

try:
    from pinecone import Pinecone
except ImportError:
    print("ERROR: pinecone-client is not installed.")
    print("  Run: pip install pinecone-client")
    sys.exit(1)

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

BRAND_ID = "eastern-healing-traditions"
BRAND_NAME = "Eastern Healing Traditions"
INDEX_NAME = "graphelion-deux"
EXPECTED_DIMENSIONS = 1536
EXPECTED_METRIC = "cosine"
EMBEDDING_MODEL = "text-embedding-3-small"

# Namespaces this client will use (created implicitly on first upsert).
CLIENT_NAMESPACES = [
    {
        "name": f"droom-content-essence-{BRAND_ID}",
        "description": (
            "Semantic profiles of creative assets (videos/images). "
            "Embedded from Claude Vision's 150-200 word narrative "
            "descriptions. Used for similarity search: 'find content "
            "similar to this,' 'what unused content matches this campaign?'"
        ),
    },
    {
        "name": f"droom-scenario-outcomes-{BRAND_ID}",
        "description": (
            "Historical campaign situations and outcomes. Embedded from "
            "rich scenario descriptions (content type, tones, demographics, "
            "platform, budget, outcome metrics). Used for: 'what happened "
            "in a situation like this?'"
        ),
    },
    {
        "name": f"droom-audience-psychographics-{BRAND_ID}",
        "description": (
            "Behavioral patterns and audience insights. Embedded from "
            "Cultural Anthropologist agent observations. Used for: "
            "'why does this audience behave this way?' 'what messaging "
            "themes resonate?'"
        ),
    },
    {
        "name": f"droom-narrative-patterns-{BRAND_ID}",
        "description": (
            "Storytelling approaches and content strategies. Embedded from "
            "Creative Intelligence agent analysis. Used for: 'what "
            "narrative styles have worked?' 'what creative gaps exist?'"
        ),
    },
]

SHARED_NAMESPACE = {
    "name": "droom-cross-campaign-learnings",
    "description": (
        "Meta-learnings applicable across all Droom clients. Embedded "
        "from aggregated insights. Tagged by industry and business_model. "
        "Used for: 'what have we learned across all clients in this "
        "industry?'"
    ),
}

# Load .env from marketing-factory root
_script_dir = Path(__file__).resolve().parent
_env_path = _script_dir / ".." / ".." / ".." / ".env"
load_dotenv(dotenv_path=_env_path)

PINECONE_API_KEY = os.environ.get("PINECONE_API_KEY")

if not PINECONE_API_KEY:
    print("ERROR: PINECONE_API_KEY environment variable is not set.")
    print(f"  Set it in your environment or in {_env_path}")
    sys.exit(1)

# ---------------------------------------------------------------------------
# Verification
# ---------------------------------------------------------------------------


def main():
    print("=" * 64)
    print("Droom Marketing Factory - Pinecone Index Verification")
    print(f"Client: {BRAND_NAME} ({BRAND_ID})")
    print(f"Target index: {INDEX_NAME}")
    print(f"Expected dimensions: {EXPECTED_DIMENSIONS}")
    print(f"Embedding model: {EMBEDDING_MODEL}")
    print("=" * 64)

    errors = []

    # --- Connect and list indexes ---
    try:
        pc = Pinecone(api_key=PINECONE_API_KEY)
        indexes = pc.list_indexes()
        index_names = [idx.name for idx in indexes]
        print(f"\nAvailable indexes: {index_names}")
    except Exception as e:
        print(f"\nERROR: Failed to connect to Pinecone: {e}")
        sys.exit(1)

    # --- Verify target index exists ---
    if INDEX_NAME not in index_names:
        print(f"\nERROR: Index '{INDEX_NAME}' does not exist.")
        print("  This is a shared index that must already be provisioned.")
        print("  Check your Pinecone dashboard or PINECONE_API_KEY.")
        sys.exit(1)

    print(f"\n[OK] Index '{INDEX_NAME}' exists.")

    # --- Verify index configuration ---
    try:
        index_info = None
        for idx in indexes:
            if idx.name == INDEX_NAME:
                index_info = idx
                break

        if index_info:
            actual_dim = index_info.dimension
            actual_metric = index_info.metric

            if actual_dim == EXPECTED_DIMENSIONS:
                print(f"[OK] Dimensions: {actual_dim} (matches {EMBEDDING_MODEL})")
            else:
                msg = (
                    f"[FAIL] Dimensions: {actual_dim} (expected "
                    f"{EXPECTED_DIMENSIONS} for {EMBEDDING_MODEL})"
                )
                print(msg)
                errors.append(msg)

            if actual_metric == EXPECTED_METRIC:
                print(f"[OK] Metric: {actual_metric}")
            else:
                msg = f"[WARN] Metric: {actual_metric} (expected {EXPECTED_METRIC})"
                print(msg)
                errors.append(msg)
    except Exception as e:
        msg = f"[WARN] Could not verify index configuration: {e}"
        print(msg)

    # --- List existing namespaces ---
    print("\n--- Existing namespaces in index ---")
    try:
        index = pc.Index(INDEX_NAME)
        stats = index.describe_index_stats()
        existing_ns = stats.namespaces if stats.namespaces else {}

        if existing_ns:
            for ns_name, ns_stats in existing_ns.items():
                prefix = "  [droom]" if ns_name.startswith("droom-") else "  [other]"
                print(f"{prefix} {ns_name} ({ns_stats.vector_count} vectors)")
        else:
            print("  (no namespaces with data yet)")

        total_vectors = stats.total_vector_count
        print(f"\n  Total vectors in index: {total_vectors}")
    except Exception as e:
        print(f"  [WARN] Could not list namespaces: {e}")

    # --- Document planned namespaces ---
    print("\n--- Planned namespaces for this client ---")
    print("  (These will be created automatically on first vector upsert)")
    print()

    all_namespaces = CLIENT_NAMESPACES + [SHARED_NAMESPACE]
    for ns in all_namespaces:
        shared_tag = " [shared]" if ns["name"] == SHARED_NAMESPACE["name"] else ""
        print(f"  {ns['name']}{shared_tag}")
        # Wrap description at ~70 chars for readability
        desc = ns["description"]
        indent = "    "
        words = desc.split()
        line = indent
        for word in words:
            if len(line) + len(word) + 1 > 74:
                print(line)
                line = indent + word
            else:
                line = line + " " + word if line.strip() else indent + word
        if line.strip():
            print(line)
        print()

    # --- Check for conflicts ---
    print("--- Namespace conflict check ---")
    if existing_ns:
        conflicts = []
        for ns in CLIENT_NAMESPACES:
            if ns["name"] in existing_ns:
                conflicts.append(ns["name"])
        if conflicts:
            print("  [WARN] These client namespaces already have data:")
            for c in conflicts:
                vec_count = existing_ns[c].vector_count
                print(f"    {c} ({vec_count} vectors)")
            print("  This is expected if re-running after prior ingestion.")
        else:
            print("  [OK] No conflicts. Client namespaces are clean.")
    else:
        print("  [OK] No existing namespaces. Clean slate.")

    # --- Summary ---
    print("\n" + "=" * 64)
    print("VERIFICATION SUMMARY")
    print("=" * 64)
    print(f"  Index '{INDEX_NAME}': EXISTS")
    print(f"  Dimensions: {EXPECTED_DIMENSIONS}")
    print(f"  Metric: {EXPECTED_METRIC}")
    print(f"  Embedding model: {EMBEDDING_MODEL}")
    print(f"  Client namespaces planned: {len(CLIENT_NAMESPACES)}")
    print(f"  Shared namespaces: 1 (droom-cross-campaign-learnings)")

    if errors:
        print(f"\n  ISSUES ({len(errors)}):")
        for err in errors:
            print(f"    {err}")
        sys.exit(1)
    else:
        print("\n  All checks passed. Index is ready for vector upserts.")


if __name__ == "__main__":
    main()
