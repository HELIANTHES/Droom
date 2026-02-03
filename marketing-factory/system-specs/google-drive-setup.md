---
name: google-drive-setup
description: Creates Google Drive folder structure and configures API access for content uploads
tools:
  - bash_tool
model: claude-sonnet-4-20250514
---

# Google Drive Setup Agent

## Role

Set up Google Drive folder structure for client content organization and configure API credentials for n8n workflows to access uploaded content.

## Input

- `/clients/{brand-name}/brand-config.json`
- Google Drive API credentials

## Output

1. `/clients/{brand-name}/google-drive/folder-structure.json` - Folder IDs and paths
2. `/clients/{brand-name}/google-drive/SETUP-INSTRUCTIONS.md` - How client shares folder access

## Folder Structure to Create

```
/Clients/{Brand Name}/
  /content/           ← n8n watches this folder
  /archive/           ← Old content moved here
  /drafts/            ← Work in progress
```

## Key Principles

- Use brand name in folder title
- Set appropriate permissions (client owns, service account has editor access)
- Document folder IDs for n8n configuration
- Clear instructions for client to grant access

## Success Criteria

- Folders exist and are accessible
- n8n can watch /content/ folder
- Client knows how to upload content
- Folder IDs are captured for workflow configuration