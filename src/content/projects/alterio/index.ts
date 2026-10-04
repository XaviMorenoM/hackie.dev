import { registerProject } from '../index'
import cover from '../../../assets/projects/alterio/cover.png'

registerProject({
  slug: 'alterio',
  name: 'Alterio',
  platform: ['ios'],
  accent: '#C6FF3D',
  accentDark: '#C6FF3D',
  accentInk: '#101400',
  githubUrl: 'https://github.com/XaviMorenoM/gym-tracker',
  cover: { src: cover, alt: '' },
  changelog: [
    {
      version: 'v0.13.18',
      date: '2026-10-02',
      notes: [
        'Exercise library with hero photo, muscle volume cards, and Info/Activity tabs.',
        'Profile: routine-level muscle card and recent workout rows with photos.',
        'Active workout: one routine-level muscle card.',
      ],
    },
  ],
})
