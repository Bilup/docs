import React from 'react';
import DocSidebarDesktop from '@theme/DocSidebar/Desktop';

// The navbar (and its mobile drawer) is removed in this build, so the mobile
// sidebar has nowhere to portal into. Always render the desktop sidebar; CSS
// turns it into a slide-in drawer on small screens, toggled by the floating button.
export default function DocSidebar(props) {
  return <DocSidebarDesktop {...props} />;
}
