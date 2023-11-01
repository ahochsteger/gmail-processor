// Import the original mapper
import { Icon } from '@iconify/react'; // Import the entire Iconify library.
import MDXComponents from '@theme-original/MDXComponents';

export default {
  // Re-use the default mapping
  ...MDXComponents,
  Icon: Icon, // Make the iconify Icon component available in MDX as <icon />.
};
