# Notes: mapping this demo to your CI self-heal pipeline plan

This repo is a local demo. Your production pipeline plan describes:
- store Allure results zip + attachments in Azure Blob
- persist failures in Postgres (test_run, test_failure, artifact, patch_attempt)
- worker applies minimal patch then validates then opens MR and updates Jira fileciteturn1file0L56-L103 fileciteturn1file1L18-L99

How to extend this demo in your worker:
1) Instead of page.content(), use DOM from Playwright trace or screenshot evidence.
   The plan lists artifact fetch tools and trace extractors for better reliability. fileciteturn1file3L31-L47
2) After healing a selector, push a branch and open an MR with evidence links and validation notes. fileciteturn1file1L89-L100
3) Validate by rerunning the failing spec only, then a small grep suite. fileciteturn1file2L215-L228
