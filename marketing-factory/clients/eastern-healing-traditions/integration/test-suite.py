#!/usr/bin/env python3
"""
Integration Test Suite — Eastern Healing Traditions
Brand ID: eastern-healing-traditions
Business Model: brick-and-mortar-primary

Tests connectivity and configuration for all integrated services.
Each test is independent. Missing credentials cause a skip with warning, not a failure.

Usage:
    python test-suite.py              # Run all tests
    python test-suite.py -v           # Verbose output
    python test-suite.py -k neo4j     # Run only Neo4j tests
"""

import os
import sys
import json
import unittest
from pathlib import Path
from functools import wraps

# ---------------------------------------------------------------------------
# Environment setup
# ---------------------------------------------------------------------------

# Load .env from the client root (two levels up from integration/)
try:
    from dotenv import load_dotenv

    env_path = Path(__file__).resolve().parent.parent / ".env"
    if env_path.exists():
        load_dotenv(dotenv_path=env_path)
        print(f"[env] Loaded environment from {env_path}")
    else:
        print(f"[env] WARNING: No .env file found at {env_path}")
        print("[env] Credentials must be set in shell environment or tests will skip.")
except ImportError:
    print("[env] WARNING: python-dotenv not installed. Run: pip install python-dotenv")
    print("[env] Falling back to shell environment variables.")

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------

BRAND_ID = "eastern-healing-traditions"
PINECONE_INDEX = "graphelion-deux"
S3_BUCKET = "droom"
S3_KEY_PREFIX = f"clients/{BRAND_ID}/"
PINECONE_NAMESPACES = [
    f"droom-content-essence-{BRAND_ID}",
    f"droom-scenario-outcomes-{BRAND_ID}",
    f"droom-audience-psychographics-{BRAND_ID}",
    f"droom-narrative-patterns-{BRAND_ID}",
    "droom-cross-campaign-learnings",
]
EXPECTED_NEO4J_CONSTRAINTS = [
    "droom_content_id_unique",
    "droom_campaign_id_unique",
    "droom_lead_id_unique",
    "droom_performance_id_unique",
    "droom_websiteform_id_unique",
    "droom_demographic_id_unique",
    "droom_geographic_id_unique",
]

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------


def requires_env(*env_vars):
    """Decorator that skips a test if any required env var is missing."""

    def decorator(func):
        @wraps(func)
        def wrapper(self, *args, **kwargs):
            missing = [v for v in env_vars if not os.getenv(v)]
            if missing:
                self.skipTest(
                    f"Skipped — missing env var(s): {', '.join(missing)}"
                )
            return func(self, *args, **kwargs)

        return wrapper

    return decorator


# ---------------------------------------------------------------------------
# Neo4j Tests
# ---------------------------------------------------------------------------


class TestNeo4jIntegration(unittest.TestCase):
    """Tests Neo4j connectivity and Droom schema constraints."""

    @requires_env("NEO4J_URI", "NEO4J_USERNAME", "NEO4J_PASSWORD")
    def setUp(self):
        try:
            from neo4j import GraphDatabase

            self.driver = GraphDatabase.driver(
                os.getenv("NEO4J_URI"),
                auth=(os.getenv("NEO4J_USERNAME"), os.getenv("NEO4J_PASSWORD")),
            )
        except ImportError:
            self.skipTest("Skipped — neo4j driver not installed. Run: pip install neo4j")

    def tearDown(self):
        if hasattr(self, "driver") and self.driver:
            self.driver.close()

    @requires_env("NEO4J_URI", "NEO4J_USERNAME", "NEO4J_PASSWORD")
    def test_connectivity(self):
        """Verify basic Neo4j connectivity."""
        with self.driver.session(
            database=os.getenv("NEO4J_DATABASE", "neo4j")
        ) as session:
            result = session.run("RETURN 1 AS ok")
            record = result.single()
            self.assertEqual(record["ok"], 1)
            print("  [PASS] Neo4j connectivity OK")

    @requires_env("NEO4J_URI", "NEO4J_USERNAME", "NEO4J_PASSWORD")
    def test_droom_constraints_exist(self):
        """Verify all expected :Droom constraints are present."""
        with self.driver.session(
            database=os.getenv("NEO4J_DATABASE", "neo4j")
        ) as session:
            result = session.run(
                "SHOW CONSTRAINTS YIELD name "
                "WHERE name STARTS WITH 'droom_' "
                "RETURN name ORDER BY name"
            )
            found = [record["name"] for record in result]
            for constraint in EXPECTED_NEO4J_CONSTRAINTS:
                self.assertIn(
                    constraint,
                    found,
                    f"Missing constraint: {constraint}. Found: {found}",
                )
            print(f"  [PASS] All {len(EXPECTED_NEO4J_CONSTRAINTS)} Droom constraints verified")

    @requires_env("NEO4J_URI", "NEO4J_USERNAME", "NEO4J_PASSWORD")
    def test_brand_isolation_query(self):
        """Verify brand isolation query returns without error."""
        with self.driver.session(
            database=os.getenv("NEO4J_DATABASE", "neo4j")
        ) as session:
            result = session.run(
                "MATCH (n:Droom) "
                "WHERE n.brand_id = $brand_id OR NOT EXISTS(n.brand_id) "
                "RETURN labels(n) AS node_labels, COUNT(n) AS count "
                "ORDER BY count DESC",
                brand_id=BRAND_ID,
            )
            records = list(result)
            print(f"  [PASS] Brand isolation query OK — {len(records)} label groups returned")


# ---------------------------------------------------------------------------
# Pinecone Tests
# ---------------------------------------------------------------------------


class TestPineconeIntegration(unittest.TestCase):
    """Tests Pinecone connectivity and index configuration."""

    @requires_env("PINECONE_API_KEY")
    def test_connectivity_and_index(self):
        """Verify Pinecone API key works and graphelion-deux index exists."""
        try:
            from pinecone import Pinecone
        except ImportError:
            self.skipTest("Skipped — pinecone client not installed. Run: pip install pinecone")

        pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
        indexes = pc.list_indexes()
        index_names = [idx.name for idx in indexes]
        self.assertIn(
            PINECONE_INDEX,
            index_names,
            f"Index '{PINECONE_INDEX}' not found. Available: {index_names}",
        )
        print(f"  [PASS] Pinecone connected — index '{PINECONE_INDEX}' exists")

    @requires_env("PINECONE_API_KEY")
    def test_index_dimensions(self):
        """Verify the index uses 1536 dimensions (text-embedding-3-small)."""
        try:
            from pinecone import Pinecone
        except ImportError:
            self.skipTest("Skipped — pinecone client not installed.")

        pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
        index = pc.Index(PINECONE_INDEX)
        stats = index.describe_index_stats()
        self.assertEqual(
            stats.dimension,
            1536,
            f"Expected 1536 dimensions, got {stats.dimension}",
        )
        print(f"  [PASS] Index dimensions: {stats.dimension} (text-embedding-3-small)")

    @requires_env("PINECONE_API_KEY")
    def test_namespace_access(self):
        """Verify Droom namespaces are accessible (may be empty initially)."""
        try:
            from pinecone import Pinecone
        except ImportError:
            self.skipTest("Skipped — pinecone client not installed.")

        pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
        index = pc.Index(PINECONE_INDEX)
        stats = index.describe_index_stats()
        existing_namespaces = set(stats.namespaces.keys()) if stats.namespaces else set()
        for ns in PINECONE_NAMESPACES:
            if ns in existing_namespaces:
                vec_count = stats.namespaces[ns].vector_count
                print(f"  [INFO] Namespace '{ns}': {vec_count} vectors")
            else:
                print(f"  [INFO] Namespace '{ns}': not yet created (OK for new setup)")
        print("  [PASS] Namespace access check complete")


# ---------------------------------------------------------------------------
# AWS S3 Tests
# ---------------------------------------------------------------------------


class TestS3Integration(unittest.TestCase):
    """Tests AWS S3 connectivity and bucket access."""

    @requires_env("AWS_ACCESS_KEY_ID", "AWS_SECRET_ACCESS_KEY")
    def test_bucket_exists(self):
        """Verify the droom S3 bucket exists and is accessible."""
        try:
            import boto3
        except ImportError:
            self.skipTest("Skipped — boto3 not installed. Run: pip install boto3")

        s3 = boto3.client(
            "s3",
            region_name="us-east-1",
            aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
            aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
        )
        try:
            s3.head_bucket(Bucket=S3_BUCKET)
            print(f"  [PASS] S3 bucket '{S3_BUCKET}' exists and is accessible")
        except s3.exceptions.ClientError as e:
            error_code = e.response["Error"]["Code"]
            if error_code == "403":
                self.fail(f"S3 bucket '{S3_BUCKET}' exists but access denied (403)")
            elif error_code == "404":
                self.fail(f"S3 bucket '{S3_BUCKET}' does not exist (404)")
            else:
                self.fail(f"S3 error: {e}")

    @requires_env("AWS_ACCESS_KEY_ID", "AWS_SECRET_ACCESS_KEY")
    def test_key_prefix_listable(self):
        """Verify the client key prefix is listable in the bucket."""
        try:
            import boto3
        except ImportError:
            self.skipTest("Skipped — boto3 not installed.")

        s3 = boto3.client(
            "s3",
            region_name="us-east-1",
            aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
            aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
        )
        response = s3.list_objects_v2(
            Bucket=S3_BUCKET, Prefix=S3_KEY_PREFIX, MaxKeys=1
        )
        # We don't require objects to exist yet, just that the prefix is queryable
        self.assertIn("KeyCount", response)
        print(
            f"  [PASS] S3 prefix '{S3_KEY_PREFIX}' is listable "
            f"({response['KeyCount']} object(s) found)"
        )


# ---------------------------------------------------------------------------
# Claude API Tests
# ---------------------------------------------------------------------------


class TestClaudeAPIIntegration(unittest.TestCase):
    """Tests Anthropic Claude API connectivity."""

    @requires_env("ANTHROPIC_API_KEY")
    def test_connectivity(self):
        """Verify Claude API key works with a minimal request."""
        try:
            import anthropic
        except ImportError:
            self.skipTest(
                "Skipped — anthropic SDK not installed. Run: pip install anthropic"
            )

        client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
        try:
            message = client.messages.create(
                model="claude-sonnet-4-20250514",
                max_tokens=16,
                messages=[{"role": "user", "content": "Respond with only: OK"}],
            )
            self.assertIsNotNone(message.content)
            print("  [PASS] Claude API connectivity OK")
        except anthropic.AuthenticationError:
            self.fail("Claude API authentication failed — check ANTHROPIC_API_KEY")
        except anthropic.APIError as e:
            self.fail(f"Claude API error: {e}")


# ---------------------------------------------------------------------------
# OpenAI API Tests
# ---------------------------------------------------------------------------


class TestOpenAIAPIIntegration(unittest.TestCase):
    """Tests OpenAI API connectivity for embeddings."""

    @requires_env("OPENAI_API_KEY")
    def test_embedding_generation(self):
        """Verify OpenAI embedding endpoint works with text-embedding-3-small."""
        try:
            import openai
        except ImportError:
            self.skipTest(
                "Skipped — openai SDK not installed. Run: pip install openai"
            )

        client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        try:
            response = client.embeddings.create(
                model="text-embedding-3-small",
                input="integration test",
            )
            embedding = response.data[0].embedding
            self.assertEqual(
                len(embedding),
                1536,
                f"Expected 1536 dimensions, got {len(embedding)}",
            )
            print(f"  [PASS] OpenAI embeddings OK — {len(embedding)} dimensions")
        except openai.AuthenticationError:
            self.fail("OpenAI authentication failed — check OPENAI_API_KEY")
        except openai.APIError as e:
            self.fail(f"OpenAI API error: {e}")


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    print("=" * 70)
    print(f"Integration Test Suite — Eastern Healing Traditions")
    print(f"Brand ID: {BRAND_ID}")
    print(f"Business Model: brick-and-mortar-primary")
    print("=" * 70)
    print()

    # Run with higher verbosity by default for clarity
    default_verbosity = 2 if "-v" not in sys.argv and "-q" not in sys.argv else 0
    unittest.main(verbosity=default_verbosity)
