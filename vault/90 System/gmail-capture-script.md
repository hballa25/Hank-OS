# Gmail → Hank OS capture script (per account)

Paste into [script.google.com](https://script.google.com) **while signed into the target account** → save → clock icon (Triggers) → add trigger: `captureLabeledEmails`, time-driven, every 15 minutes. Repeat per Gmail account. Label any email `brain` and it lands in that account's `HankOS Inbox` folder in Drive as Markdown.

```javascript
// Hank OS Gmail capture — label an email "brain", get a Markdown note in Drive.
const LABEL = 'brain';
const DONE_LABEL = 'brain-captured';
const FOLDER = 'HankOS Inbox';
const ACCOUNT = Session.getActiveUser().getEmail();

function captureLabeledEmails() {
  const label = GmailApp.getUserLabelByName(LABEL);
  if (!label) return;
  const done = GmailApp.getUserLabelByName(DONE_LABEL) || GmailApp.createLabel(DONE_LABEL);
  const folders = DriveApp.getFoldersByName(FOLDER);
  const folder = folders.hasNext() ? folders.next() : DriveApp.createFolder(FOLDER);

  for (const thread of label.getThreads(0, 20)) {
    const msg = thread.getMessages()[0];
    const stamp = Utilities.formatDate(msg.getDate(), Session.getScriptTimeZone(), 'yyyy-MM-dd HHmm');
    const title = (stamp + ' ' + msg.getSubject()).replace(/[<>:"/\\|?*#]/g, '').slice(0, 80);
    const body = [
      '---',
      'captured: ' + msg.getDate().toISOString(),
      'source: gmail (' + ACCOUNT + ')',
      'from: "' + msg.getFrom().replace(/"/g, "'") + '"',
      'type: followup',
      '---',
      '',
      '# ' + msg.getSubject(),
      '',
      msg.getPlainBody().slice(0, 5000),
    ].join('\n');
    folder.createFile(title + '.md', body, 'text/markdown');
    thread.removeLabel(label);
    thread.addLabel(done);
  }
}
```

**Flow:** label `brain` → script (≤15 min) → `HankOS Inbox` in that account's Drive → Drive for Desktop syncs to PC → listed as a Source in `dashboard/sources.json` (visible in galaxy) and/or swept by the Gardener into `00 Inbox/`. See [[connections]].
