---
title: Troubleshooting
sidebar_position: 11
---

# Troubleshooting

This comprehensive troubleshooting guide helps you resolve common issues when using MistWarp. From project loading problems to performance issues, find solutions to get back to creating quickly.

## Project Loading Issues

### Project Won't Load

#### Symptoms
- Blank screen when loading project
- "Project failed to load" error message
- Infinite loading spinner

#### Common Causes & Solutions

**Invalid Project ID**
```
❌ Problem: Project ID doesn't exist or is private
✅ Solution: Verify project ID and ensure it's shared publicly
```

**Network Connectivity**
```bash
# Test connectivity
ping warp.mistium.com

# Check browser console for network errors
# F12 → Console tab → Look for red errors
```

**Browser Compatibility**
```
❌ Problem: Outdated browser version
✅ Solution: Update to latest Chrome, Firefox, Safari, or Edge
Minimum versions: Chrome 80+, Firefox 74+, Safari 13+
```

**Corrupted Project File**
```
❌ Problem: Project file is damaged or corrupted
✅ Solutions:
1. Try loading a backup version
2. Re-download from original source
3. Use project repair tools
```

### Slow Project Loading

#### Optimization Steps

**Enable Turbo Mode**
```
https://warp.mistium.com/123456789?turbo
```

**Reduce Project Size**
- Remove unused sprites and sounds
- Compress large images before importing
- Optimize sound files (use MP3 instead of WAV)

**Clear Browser Cache**
```bash
# Chrome: Ctrl+Shift+Delete
# Firefox: Ctrl+Shift+Delete  
# Safari: Cmd+Option+E
```

## Performance Issues

### Low Frame Rate

#### Diagnosis
Check current FPS in MistWarp:
```scratch
when green flag clicked
forever
  say (join [FPS: ] (fps)) for (0.1) seconds
end
```

#### Solutions

**Enable Performance Features**
```
https://warp.mistium.com/?turbo&fps=60
```

**Optimize Project Code**
```scratch
// ❌ Inefficient
forever
  if <touching [Sprite1 v]?> then
    // Complex calculations every frame
  end
end

// ✅ Efficient  
forever
  if <touching [Sprite1 v]?> then
    // Move complex code to separate script
    broadcast [collision detected v]
  end
end
```

**Reduce Visual Complexity**
- Limit number of visible sprites
- Use simpler costumes
- Reduce pen drawing complexity
- Disable unnecessary visual effects

### Memory Issues

#### Symptoms
- Browser becomes unresponsive
- "Out of memory" errors
- Gradual performance degradation

#### Solutions

**Monitor Memory Usage**
```javascript
// Check memory in browser console
console.log(performance.memory);
```

**Optimize Asset Usage**
- Remove unused costumes and sounds
- Use appropriate image formats (PNG for transparency, JPEG for photos)
- Limit sound file sizes

**Code Optimization**
```scratch
// ❌ Memory leak - lists grow infinitely
forever
  add [item] to [my list v]
end

// ✅ Proper cleanup
forever
  add [item] to [my list v]
  if <(length of [my list v]) > (100)> then
    delete (1) of [my list v]
  end
end
```

## Interface Issues

### Missing Interface Elements

#### Blank Screen
```
❌ Problem: Interface doesn't load
✅ Solutions:
1. Disable browser extensions
2. Clear cookies and cache
3. Try incognito/private mode
4. Check for JavaScript errors in console
```

#### Controls Not Responding
```
❌ Problem: Buttons don't work
✅ Solutions:
1. Refresh the page (F5)
2. Check if JavaScript is enabled
3. Try different browser
4. Disable ad blockers temporarily
```

### Theme and Display Issues

#### Theme Not Loading
```
❌ Problem: Theme appears broken or default
✅ Solutions:
1. Clear browser cache
2. Use the settings menu to change theme
3. Reset theme settings
4. Check for CSS loading errors in console
```

#### Custom Stage Size Problems
```
❌ Problem: Stage size is wrong
✅ Solutions:
1. Use valid size format: ?size=800x600
2. Check browser zoom level (should be 100%)
3. Use the fullscreen control in the player header
4. Refresh page after changing size
```

## Audio Issues

### No Sound

#### Check Audio Settings
```javascript
// Test audio in browser console
new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmkcBj2b3O/AcyMFLInA7d+5nF0XKWm+79+QRAoUYK/+6qtSDAvSq+vtwmMlBs+R2vPmbiMFLXPN8d2NQwoKH0+z/+6iUQwGWrzz77aZdE4YFQobqeu1xmMjBy2F+fTflUQHbKz5/d9HYfTAaJWkLo2Gx8k=').play();
```

#### Common Solutions
1. **Check Browser Audio**: Ensure browser audio isn't muted
2. **Check System Volume**: Verify system volume is up
3. **Audio Context**: Some browsers require user interaction first
4. **Audio Format**: Try different audio formats (MP3, WAV)

### Distorted Audio
```
❌ Problem: Audio sounds wrong or distorted
✅ Solutions:
1. Check audio sample rate (22050 Hz recommended)
2. Try different audio format
3. Reduce audio file size
4. Check for audio conflicts with other tabs
```

## Addon Issues

### Addons Not Working

#### Enable Addons
```
1. Click settings gear icon
2. Go to "Addons" tab
3. Enable desired addons
4. Refresh page if needed
```

#### Addon Conflicts
```
❌ Problem: Addons interfere with each other
✅ Solutions:
1. Disable one addon at a time to identify conflict
2. Check addon compatibility lists
3. Report conflicts to addon developers
4. Use alternative addons
```

### Custom Addon Issues
```javascript
// Debug addon loading
console.log(vm.runtime.extensionManager.allExtensions);

// Check for addon errors
window.addEventListener('error', (e) => {
  console.log('Addon error:', e);
});
```

## Cloud Variable Issues

### Cloud Variables Not Syncing

#### Check Connection
```scratch
// Test cloud variable connectivity
set [☁ test v] to (timer)
wait (1) seconds
if <(☁ test) = (timer)> then
  say [Cloud variables working] for (2) seconds
else
  say [Cloud variables offline] for (2) seconds
end
```

#### Common Solutions
1. **Internet Connection**: Check network connectivity
2. **Project Sharing**: Ensure project is shared publicly
3. **Rate Limits**: Avoid updating too frequently
4. **Username**: Set username in project or URL: `?username=alice`

### Data Not Persisting
```
❌ Problem: Cloud variables reset
✅ Solutions:
1. Check variable name has ☁ prefix
2. Verify data size limits (100KB per variable)
3. Check for special characters in data
4. Ensure proper variable type (cloud variables only)
```

## Extension and JavaScript Issues

### JavaScript Not Working

#### Enable JavaScript
```
https://warp.mistium.com/?unsafe
```

#### Security Warnings
```
❌ Problem: "Unsafe scripts" warning
✅ Solutions:
1. Only enable for trusted projects
2. Review JavaScript code carefully
3. Use sandboxed extensions when possible
4. Report suspicious scripts
```

#### Common JavaScript Errors
```javascript
// ❌ Common mistake
vm.runtime.targets[0].variables.myVar.value = 100;

// ✅ Correct approach
const stage = vm.runtime.getTargetForStage();
const variable = stage.lookupVariableByNameAndType('myVar', '');
if (variable) variable.value = 100;
```

## Browser-Specific Issues

### Chrome Issues
```
Common problems:
- Hardware acceleration conflicts
- Extension interference
- Memory limitations

Solutions:
- Disable hardware acceleration in Chrome settings
- Try incognito mode
- Clear Chrome cache and cookies
```

### Firefox Issues
```
Common problems:
- WebGL compatibility
- Audio context limitations
- Security restrictions

Solutions:
- Enable WebGL in Firefox settings
- Allow autoplay audio
- Check Enhanced Tracking Protection settings
```

### Safari Issues
```
Common problems:
- Limited WebGL support
- Audio restrictions
- Cache issues

Solutions:
- Enable WebGL in Safari preferences
- Allow audio autoplay for site
- Clear Safari cache
```

## Mobile Device Issues

### Touch Controls
```
❌ Problem: Touch doesn't work properly
✅ Solutions:
1. Use mobile-optimized projects
2. Enable touch controls in settings
3. Check for touch event conflicts
4. Try different mobile browser
```

### Performance on Mobile
```
❌ Problem: Slow performance on mobile
✅ Solutions:
1. Reduce project complexity
2. Lower frame rate: ?fps=30
3. Disable high-quality pen
4. Close other mobile apps
```

## Network and Connectivity

### Loading Timeout
```
❌ Problem: Projects timeout while loading
✅ Solutions:
1. Check internet speed
2. Try different network
3. Use mobile data as backup
4. Contact ISP if persistent
```

### Firewall Issues
```
❌ Problem: Corporate firewall blocks MistWarp
✅ Solutions:
1. Contact IT department
2. Use alternative network
3. Try a different browser
4. Request whitelist for warp.mistium.com
```

## Getting Help

### Debug Information
When reporting issues, include:
```
- Browser version and OS
- Project ID (if applicable)
- Error messages from console (F12)
- Steps to reproduce
- Expected vs actual behavior
```

### Console Debugging
```javascript
// Get MistWarp version
console.log(vm.runtime.platform);

// Check for errors
console.log(vm.runtime.getLastError());

// Export debug info
console.log({
  userAgent: navigator.userAgent,
  performance: performance.memory,
  extensions: vm.runtime.extensionManager.allExtensions
});
```

### Community Support
- **GitHub Issues**: Report bugs and feature requests
- **Community Forums**: Get help from other users
- **Discord/Chat**: Real-time community support
- **Documentation**: Check latest docs for updates

### Professional Support
For commercial or educational use:
- **Priority Support**: Faster response times
- **Custom Solutions**: Tailored troubleshooting
- **Training**: Comprehensive user training
- **Integration Help**: Embedding and API support

Remember: Most issues can be resolved quickly with basic troubleshooting. Start with simple solutions like refreshing the page or clearing cache before moving to more complex debugging steps!
