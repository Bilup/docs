---
title: Embedding
sidebar_position: 6
---

# Embedding MistWarp Projects

MistWarp provides powerful embedding capabilities that allow you to integrate projects into websites, applications, and other platforms with enhanced features and customization options.

## Basic Embedding

### Simple iframe Embedding
The easiest way to embed a MistWarp project:

```html
<iframe
  src="https://warp.mistium.com/123456789/embed"
  width="480"
  height="360"
  frameborder="0"
  scrolling="no"
  allowfullscreen>
</iframe>
```

### Enhanced Embedding
Supported embed parameters include `autoplay`, `addons`, and standard runtime options like `turbo`, `fps`, `hqpen`, `interpolate`, and `size`:

```html
<iframe
  src="https://warp.mistium.com/123456789/embed?autoplay&turbo&fps=60"
  width="800"
  height="600"
  frameborder="0"
  scrolling="no"
  allowfullscreen>
</iframe>
```

## Embedding Parameters

### Basic Parameters

| Parameter | Values | Description |
|-----------|--------|-------------|
| `autoplay` | boolean | Auto-start project on load |
| `username` | string | Set username used by blocks |
| `turbo` | boolean | Enable turbo mode |

### Display Parameters

| Parameter | Values | Description |
|-----------|--------|-------------|
| `fps` | number | Set frame rate |
| `hqpen` | boolean | High quality pen rendering |
| `size` | WIDTHxHEIGHT | Custom stage dimensions |
| `interpolate` | boolean | Enable motion interpolation |

### Embed-Specific Parameters

| Parameter | Values | Description |
|-----------|--------|-------------|
| `addons` | comma list | Enable specific addons (eg. `pause,gamepad`) |
| `settings-button` | boolean | Show settings button in player header |
| `fullscreen-background` | CSS color | Fullscreen background color override |

## Advanced Embedding

### Responsive Embedding
Create responsive embeds that adapt to container size:

```html
<div style="position: relative; padding-bottom: 75%; height: 0;">
  <iframe
    src="https://warp.mistium.com/123456789/embed"
    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
    frameborder="0"
    allowfullscreen>
  </iframe>
</div>
```

### Custom Theming
Theme and accent are not controlled by URL parameters in embeds. Use CSS around the iframe or the Packager for theme control.

## JavaScript API Integration

### PostMessage Communication
Embeds accept `LOAD_SB3` messages for loading projects. See detailed guide: [/user-guide/embed-messaging](/user-guide/embed-messaging).

```javascript
// Send SB3 to the embed (URL or binary)
const iframe = document.getElementById('mistwarp-embed');
iframe.contentWindow.postMessage({
  type: 'LOAD_SB3',
  data: 'https://example.com/project.sb3',
  title: 'Optional Title'
}, '*');

// Receive load response
window.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'LOAD_SB3_RESPONSE') {
    console.log(event.data.status, event.data.message);
  }
});
```

### Event Handling
Embeds do not emit general project events via `postMessage`. Use the VM API within the embed context if you need state.

## Packager Integration

### Standalone Embeds
Use the MistWarp Packager for standalone embeds:

1. Visit [packager.warp.mistium.com](https://packager.warp.mistium.com)
2. Enter your project URL or upload project file
3. Configure embedding options
4. Download generated HTML file

### Self-Hosted Embeds
Host projects on your own server:

```html
<!-- Self-hosted project -->
<iframe
  src="/path/to/your/project.html"
  width="480"
  height="360">
</iframe>
```

## Embedding Best Practices

### Performance Optimization

#### Lazy Loading
Load embeds only when needed:

```javascript
// Intersection Observer for lazy loading
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const iframe = entry.target;
      iframe.src = iframe.dataset.src;
      observer.unobserve(iframe);
    }
  });
});

document.querySelectorAll('iframe[data-src]').forEach(iframe => {
  observer.observe(iframe);
});
```

#### Preloading
Preload critical resources:

```html
<link rel="preload" href="https://warp.mistium.com/assets/scratch-vm.js" as="script">
<link rel="preload" href="https://warp.mistium.com/assets/scratch-gui.js" as="script">
```

### Accessibility

#### Screen Reader Support
Provide alternative content for screen readers:

```html
<iframe
  src="https://warp.mistium.com/123456789/embed"
  title="Interactive Math Game - Practice Addition and Subtraction"
  aria-label="Scratch game for practicing math skills">
  <p>This is an interactive math game that helps practice addition and subtraction.
     If you cannot access the game, please <a href="/alternative-math-practice">
     try our alternative version</a>.</p>
</iframe>
```

#### Keyboard Navigation
Ensure embedded projects support keyboard navigation by focusing the iframe or providing external controls.

## Security Considerations

### Content Security Policy
Configure CSP headers for embedded content:

```http
Content-Security-Policy: frame-src https://warp.mistium.com;
```

### Sandbox Attributes
Use sandbox attributes for additional security:

```html
<iframe
  src="https://warp.mistium.com/123456789/embed"
  sandbox="allow-scripts allow-same-origin allow-fullscreen">
</iframe>
```

## Platform-Specific Embedding

### WordPress
Use WordPress shortcodes or embed blocks:

```php
// Custom shortcode for MistWarp embeds
function mistwarp_embed_shortcode($atts) {
  $atts = shortcode_atts([
    'id' => '',
    'width' => 480,
    'height' => 360,
    'autoplay' => false,
    'turbo' => false
  ], $atts);
  
  $src = "https://warp.mistium.com/{$atts['id']}/embed";
  if ($atts['autoplay']) $src .= "?autoplay";
  if ($atts['turbo']) $src .= $atts['autoplay'] ? "&turbo" : "?turbo";
  
  return "<iframe src='{$src}' width='{$atts['width']}' height='{$atts['height']}' frameborder='0'></iframe>";
}
add_shortcode('mistwarp', 'mistwarp_embed_shortcode');
```

### React/Vue.js
Create reusable components:

```jsx
// React component
import React from 'react';

const MistWarpEmbed = ({ 
  projectId, 
  width = 480, 
  height = 360, 
  autoplay = false,
  turbo = false 
}) => {
  const params = new URLSearchParams();
  if (autoplay) params.append('autoplay', '');
  if (turbo) params.append('turbo', '');
  
  const src = `https://warp.mistium.com/${projectId}/embed?${params}`;
  
  return (
    <iframe
      src={src}
      width={width}
      height={height}
      frameBorder="0"
      allowFullScreen
    />
  );
};

export default MistWarpEmbed;
```

## Troubleshooting Embedding

### Common Issues

#### Project Not Loading
- Check project ID is correct
- Verify project is shared publicly
- Check network connectivity
- Try different embedding parameters

#### Performance Issues
- Enable turbo mode: `?turbo`
- Reduce frame rate if needed: `?fps=30`
- Check browser compatibility
- Monitor memory usage

#### Display Problems
- Verify iframe dimensions
- Check CSS conflicts
- Test responsive behavior
- Validate HTML structure

### Debugging
Use the browser devtools console and network inspector. There is no `debug` URL parameter.

MistWarp's embedding capabilities make it easy to integrate interactive content into any website or application. Use these features to create engaging, interactive experiences for your users!
