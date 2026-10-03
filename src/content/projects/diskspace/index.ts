import { registerProject } from '../index';

registerProject({
  slug: 'diskspace',
  name: 'Diskspace',
  screenshot: '/projects/diskspace/screenshot.png',
  screenshotDark: '/projects/diskspace/screenshot-dark.png',
  platform: ['cli', 'macos'],
  accent: '#4E79A7',
  accentDark: '#4E79A7',
  accentInk: '#F5F5F5',
  githubUrl: 'https://github.com/XaviMorenoM/diskspace',
  installCommand: 'go install github.com/XaviMorenoM/diskspace/cmd/diskspace@latest',
  changelog: [
    {
      version: 'v0.2.2',
      date: '2026-10-02',
      notes: ['Universal binary (arm64 + x86_64) for Diskspace.app.'],
    },
    {
      version: 'v0.2.1',
      date: '2026-10-02',
      notes: ['Modified and Accessed timestamp columns in List view.'],
    },
    {
      version: 'v0.2.0',
      date: '2026-09-29',
      notes: [
        'Native macOS window with treemap tiles, List view, nav history and toolbar search.',
        'Sidebar with Locations, Suggestions and Ready to Remove panel.',
        'SwiftUI frontend with Liquid Glass design, full keyboard support and VoiceOver.',
      ],
    },
    {
      version: 'v0.1.2',
      date: '2026-09-26',
      notes: [
        'One-command install via GitHub CLI (`install.sh`).',
        'Search by size, kind, extension, hint and name in the native window.',
        'IPC transport connecting the Go core to the Swift UI layer.',
      ],
    },
    {
      version: 'v0.1.1',
      date: '2026-09-26',
      notes: [
        'Animated deleting screen with live per-item status (pending, done, failed).',
        'Trash and permanent deletion modes, switchable mid-session with `p`.',
        'Review screen with confirmation field and 5-second abort countdown.',
      ],
    },
  ],
});
