# AWS S3 Storage Structure — Eastern Healing Traditions

## Overview

All Eastern Healing Traditions content is stored in the **droom** S3 bucket (us-east-1 region). The bucket is shared across all Droom Marketing Factory clients. Content is organized by prefix to separate active, archived, and draft materials.

**Important:** Only access the `eastern-healing-traditions/` prefix. Never access other clients' prefixes.

## Bucket & Region

- **Bucket Name:** `droom`
- **Region:** `us-east-1`
- **Access:** AWS credentials from `.env` file (`AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`)

## Prefix Structure

### 1. Content Prefix (Active & Monitored)
```
s3://droom/clients/eastern-healing-traditions/content/
```

**Purpose:** Primary location for active content ready for distribution and integration.

**Monitoring:** This prefix is continuously monitored by n8n automation. Any new uploads to this prefix automatically trigger content ingestion workflows.

**Use Case:** Upload finalized videos, images, testimonials, and marketing assets here.

### 2. Archive Prefix (Retired Content)
```
s3://droom/clients/eastern-healing-traditions/archive/
```

**Purpose:** Store retired, replaced, or superseded content.

**Monitoring:** Not monitored by n8n. No automatic triggers.

**Use Case:** Move content here when it's no longer actively used but should be retained for reference, compliance, or historical purposes.

### 3. Drafts Prefix (Work in Progress)
```
s3://droom/clients/eastern-healing-traditions/drafts/
```

**Purpose:** Temporary working directory for incomplete or experimental assets.

**Monitoring:** Not monitored by n8n. No automatic triggers.

**Use Case:** Upload raw footage, work-in-progress edits, or test files here before finalizing to `/content/`.

## File Naming Conventions

Use **descriptive, lowercase names** with hyphens separating components:

```
{project}-{sequence}-{description}-{type}.{extension}
```

### Examples:
- `brief-01-patricia-testimonial-full.mp4`
- `brief-02-james-interview-30sec.mp4`
- `background-01-meditation-garden.jpg`
- `hero-image-eastern-healing-center.png`
- `content-hub-02-ayurveda-overview-1080p.mov`

**Guidelines:**
- Use hyphens (not underscores) to separate words
- Keep names concise but descriptive
- Include sequence numbers for related content (brief-01, brief-02, etc.)
- Specify duration or format when relevant (30sec, 1080p, full)
- Always include file extension

## Supported File Types

### Video
- `mp4` — H.264 video codec, AAC audio (preferred)
- `mov` — QuickTime format, common for professional editing

### Images
- `jpg` — JPEG format for photographs and complex images
- `png` — PNG format for images with transparency

Do not upload other formats (e.g., AVI, WebM, GIF, BMP) without prior approval.

## Upload Instructions

### Method 1: AWS CLI

**Prerequisites:**
- AWS CLI installed and configured
- Credentials set in `.env` or AWS credentials file

**Upload single file to content (monitored):**
```bash
aws s3 cp brief-01-patricia-testimonial-full.mp4 \
  s3://droom/clients/eastern-healing-traditions/content/
```

**Upload file to drafts (not monitored):**
```bash
aws s3 cp work-in-progress.mp4 \
  s3://droom/clients/eastern-healing-traditions/drafts/
```

**Upload entire directory:**
```bash
aws s3 sync ./videos/ \
  s3://droom/clients/eastern-healing-traditions/content/ \
  --include "*.mp4" --include "*.mov"
```

**Move file from drafts to content:**
```bash
aws s3 cp \
  s3://droom/clients/eastern-healing-traditions/drafts/final-video.mp4 \
  s3://droom/clients/eastern-healing-traditions/content/brief-01-final-video.mp4
```

**Archive old content:**
```bash
aws s3 cp \
  s3://droom/clients/eastern-healing-traditions/content/old-brief.mp4 \
  s3://droom/clients/eastern-healing-traditions/archive/
```

### Method 2: Pre-Signed URLs

Generate a pre-signed URL for time-limited uploads (useful for third-party collaborators):

```bash
aws s3 presign s3://droom/clients/eastern-healing-traditions/content/new-file.mp4 \
  --expires-in 3600
```

This generates a URL valid for 1 hour (3600 seconds). Increase `--expires-in` as needed.

**Share the URL** with collaborators for direct uploads without exposing AWS credentials.

### Method 3: AWS Console (Web Interface)

1. Log in to AWS S3 Console
2. Select the `droom` bucket
3. Navigate to `clients/eastern-healing-traditions/content/` (or appropriate prefix)
4. Click "Upload" and select files
5. Set permissions (typically private, accessed via n8n)
6. Complete upload

## n8n Content Ingestion Workflow

**Trigger:** New object upload to `s3://droom/clients/eastern-healing-traditions/content/*`

**Workflow:**
1. S3 event notification detects new file
2. n8n workflow is triggered
3. File metadata (name, size, type, timestamp) is extracted
4. Content is processed and cataloged
5. Notifications are sent to relevant team members
6. Asset becomes available for distribution and integration

**Note:** Only files uploaded to `/content/` trigger automation. Files in `/drafts/` and `/archive/` do not trigger workflows.

## Environment Configuration

AWS credentials are stored in the `.env` file at the project root:

```
AWS_ACCESS_KEY_ID=your_access_key_id
AWS_SECRET_ACCESS_KEY=your_secret_access_key
AWS_REGION=us-east-1
S3_BUCKET=droom
```

Never commit `.env` to version control. Load credentials at runtime from environment variables.

## Best Practices

1. **Organize by Project:** Use sequence numbers for related content (brief-01, brief-02, etc.)
2. **Use Drafts First:** Upload to `/drafts/` for review before moving to `/content/`
3. **Archive Regularly:** Move old content to `/archive/` to keep `/content/` focused
4. **Descriptive Names:** Use clear, searchable names that indicate content type and purpose
5. **Version Control:** Include version numbers or dates if content is frequently updated
6. **Check Permissions:** Ensure files are not publicly readable unless intentionally shared
7. **Respect Prefix Boundaries:** Only work within `eastern-healing-traditions/` prefix

## Troubleshooting

**Upload fails with "Access Denied":**
- Verify AWS credentials in `.env` are valid
- Confirm IAM user has `s3:PutObject` permission
- Check bucket name and region are correct

**n8n workflow not triggering:**
- Verify file is uploaded to `/content/` prefix (not `/drafts/` or `/archive/`)
- Check S3 event notifications are configured
- Confirm n8n workflow is enabled
- Check file format is supported

**Can't access other clients' content:**
- This is intentional for security
- Contact admin if you need cross-client access
- Use separate credentials if managing multiple clients

## Support

For issues, questions, or access requests:
- Review this documentation first
- Check n8n workflow logs for ingestion errors
- Contact the DevOps/Infrastructure team for credential or permission issues
