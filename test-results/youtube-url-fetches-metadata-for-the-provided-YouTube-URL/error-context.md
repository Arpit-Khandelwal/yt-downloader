# Page snapshot

```yaml
- generic [ref=e4]:
  - generic [ref=e5]:
    - generic [ref=e6]:
      - generic [ref=e7]: WASM-first
      - generic [ref=e8]: Server-light
      - generic [ref=e9]: Adaptive strategy
    - heading "Download cleanly. Merge locally. Fall back only when needed." [level=1] [ref=e10]
    - paragraph [ref=e11]: "Paste a YouTube URL and this app chooses the smartest path for the current device: direct stream, browser FFmpeg merge, or quota-limited fallback when local execution looks risky."
    - generic [ref=e12]:
      - generic [ref=e13]:
        - paragraph [ref=e14]: Mode priority
        - paragraph [ref=e15]: Direct first
      - generic [ref=e16]:
        - paragraph [ref=e17]: Client path
        - paragraph [ref=e18]: WASM + FFmpeg
      - generic [ref=e19]:
        - paragraph [ref=e20]: Fallback policy
        - paragraph [ref=e21]: Quota-guarded
  - generic [ref=e23]:
    - paragraph [ref=e24]: Policy confirmation required
    - paragraph [ref=e25]: Use this tool only for content you are authorized to download. Hosted public mode supports only public-accessible content and excludes auth-cookie bypass flows.
    - button "I understand" [ref=e26] [cursor=pointer]
  - generic [ref=e28]:
    - group [ref=e29]:
      - generic [ref=e30]: YouTube video URL
      - generic [ref=e31]:
        - textbox "YouTube video URL" [ref=e32]:
          - /placeholder: https://www.youtube.com/watch?v=...
        - button "Fetch formats" [disabled] [ref=e33]
    - paragraph [ref=e34]: Single-video URL for v1. Strategy is computed per device and format size.
```