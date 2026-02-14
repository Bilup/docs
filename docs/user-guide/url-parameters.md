---
title: URL Parameters
sidebar_position: 10
---

# URL Parameters

MistWarp supports URL parameters that let you load projects and adjust runtime and compiler behavior. These are useful for embedding, automation, and sharing reproducible setups.

## Basic Usage

### URL Parameter Syntax
Add parameters using standard query string format:
```
https://warp.mistium.com/?parameter1&parameter2=value&parameter3=value
```

### Multiple Parameters
Combine multiple parameters with `&`:
```
https://warp.mistium.com/?turbo&fps=60&username=alice&autoplay
```

## Project Loading

### Load by ID
Load a Scratch project by its ID:
```
https://warp.mistium.com/123456789
```

### Load from URL
Load a project from a direct URL:
```
https://warp.mistium.com/?project_url=https://example.com/project.sb3
```

### Auto-start (embed only)
Automatically start the project in embeds:
```
https://warp.mistium.com/123456789?autoplay
```

### Username
Set the username used by cloud variables and blocks:
```
https://warp.mistium.com/123456789?username=alice
```

## Performance

### Turbo Mode
Enable high-speed execution:
```
https://warp.mistium.com/?turbo
```

### Frame Rate
Set custom frame rate:
```
https://warp.mistium.com/?fps=60     # 60 FPS
https://warp.mistium.com/?fps=120    # 120 FPS
https://warp.mistium.com/?fps=30     # 30 FPS (default)
```

### High Quality Pen
Enable anti-aliased pen rendering:
```
https://warp.mistium.com/?hqpen
```

### Interpolation
Enable frame interpolation for smoother motion:
```
https://warp.mistium.com/?interpolate
```

### Remove Misc Limits
Disable certain runtime limits:
```
https://warp.mistium.com/?limitless
```

## Display

### Custom Stage Size
Set custom stage dimensions:
```
https://warp.mistium.com/?size=800x600
https://warp.mistium.com/?size=1920x1080
```

### Fullscreen Background (player-only)
Control fullscreen background color:
```
https://warp.mistium.com/?fullscreen-background=%23abc123
```

### Offscreen Fencing
Disable offscreen fencing:
```
https://warp.mistium.com/?offscreen
```

### Clone Limit
Set maximum clones:
```
https://warp.mistium.com/?clones=300
```

## Extensions

### Load Extensions
Load custom extensions by URL (unsandboxed recommended):
```
https://warp.mistium.com/?extension=https://example.com/ext.js
https://warp.mistium.com/?extension=https://example.com/other.js
```

### Addons (embed only)
Enable specific addons in embeds:
```
https://warp.mistium.com/123456789/embed?addons=pause,gamepad
```

## Embedding

### Autoplay and Addons
Embed-specific options:
```
https://warp.mistium.com/123456789/embed?autoplay
https://warp.mistium.com/123456789/embed?addons=pause,gamepad
```

## Development

### Disable Compiler
Turn off the compiler (for debugging):
```
https://warp.mistium.com/?nocompile
```

### Project URL
Load project data from a direct URL:
```
https://warp.mistium.com/?project_url=https://example.com/project.sb3
```

### Cloud Host (embed/player)
Override cloud server:
```
https://warp.mistium.com/?cloud_host=wss://clouddata.turbowarp.org
```

## Reference

## Complete Parameter Reference

### Performance
| Parameter | Values | Description |
|-----------|--------|-------------|
| `turbo` | boolean | Enable turbo mode |
| `fps` | number | Set frame rate |
| `hqpen` | boolean | High quality pen |
| `interpolate` | boolean | Enable interpolation |
| `limitless` | boolean | Disable misc limits |
| `stuck` | boolean | Enable warp timer (player-only) |

### Display
| Parameter | Values | Description |
|-----------|--------|-------------|
| `size` | WIDTHxHEIGHT | Custom stage size |
| `fullscreen-background` | CSS color | Fullscreen background color |
| `offscreen` | boolean | Disable offscreen fencing |

### Project
| Parameter | Values | Description |
|-----------|--------|-------------|
| `username` | string | Username |
| `project_url` | URL | Load from URL |

### Extensions
| Parameter | Values | Description |
|-----------|--------|-------------|
| `extension` | URL | Load extension by URL |

### Development
| Parameter | Values | Description |
|-----------|--------|-------------|
| `nocompile` | boolean | Disable compiler |
| `cloud_host` | wss://... | Custom cloud host |

## URL Parameter Examples

### Gaming Setup
Optimized for games:
```
https://warp.mistium.com/123456789?turbo&fps=60&interpolate
```

### Educational Embedding
Clean embed for education:
```
https://warp.mistium.com/123456789/embed?autoplay&size=800x600
```

### Development Testing
Development environment:
```
https://warp.mistium.com/?turbo&fps=120&hqpen
```

### High Performance
Maximum performance:
```
https://warp.mistium.com/?turbo&fps=120&hqpen
```

### Accessible Mode
Use OS/browser accessibility features. Theme is controlled in the UI, not via URL.

## URL Encoding

### Special Characters
Encode special characters in URLs:
```
Space: %20
#: %23
&: %26
=: %3D
```

### Example with Encoding
```
https://warp.mistium.com/?fps=60&hqpen
```

## JavaScript URL Manipulation

### Reading Parameters
```javascript
const urlParams = new URLSearchParams(window.location.search);
const turboMode = urlParams.has('turbo');
const fps = urlParams.get('fps') || '30';
```

### Setting Parameters
```javascript
const url = new URL(window.location);
url.searchParams.set('fps', '60');
url.searchParams.set('turbo', '');
window.history.pushState({}, '', url);
```

### Building URLs Programmatically
```javascript
function buildMistWarpURL(projectId, options = {}) {
  const url = new URL(`https://warp.mistium.com/${projectId}`);
  
  Object.entries(options).forEach(([key, value]) => {
    if (value === true) {
      url.searchParams.set(key, '');
    } else if (value !== false && value !== null) {
      url.searchParams.set(key, value);
    }
  });
  
  return url.toString();
}

// Usage
const gameURL = buildMistWarpURL('123456789', {
  turbo: true,
  fps: 60,
  interpolate: true
});
```

## Best Practices

### URL Length
- Keep URLs reasonable length (under 2000 characters)
- Use essential parameters only
- Consider using short parameter names

### User Experience
- Provide sensible defaults
- Use autoplay sparingly
- Test URLs thoroughly

### Performance
- Combine compatible performance parameters
- Test performance impact of parameter combinations
- Monitor for conflicts between parameters

URL parameters provide powerful customization capabilities for MistWarp. Use them to create tailored experiences for different users and use cases!
