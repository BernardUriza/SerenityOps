/**
 * Icon System Diagnostic Test
 * Verifies that all icons resolve correctly without errors
 */

import { getIconByName, getIconCacheStats } from '../icons';

/**
 * Test icons that were previously missing
 */
const problematicIcons = [
  'bar-chart',
  'activity',
  'book',
  'shield',
  'clipboard',
];

/**
 * Test all navigation icons
 */
const navigationIcons = [
  'message-circle',
  'download',
  'user',
  'briefcase',
  'rocket',
  'lightning',
  'graduation-cap',
  'file',
  'dollar-sign',
  'target',
];

/**
 * Run icon resolution tests
 */
export const testIconResolution = () => {
  console.log('🧪 Icon System Diagnostic Test\n');
  console.log('━'.repeat(60));

  let passed = 0;
  let failed = 0;

  // Test problematic icons
  console.log('\n📊 Testing Previously Missing Icons:');
  problematicIcons.forEach((iconName) => {
    const icon = getIconByName(iconName);
    if (icon) {
      console.log(`✅ ${iconName.padEnd(20)} → Resolved`);
      passed++;
    } else {
      console.log(`❌ ${iconName.padEnd(20)} → NOT FOUND`);
      failed++;
    }
  });

  // Test navigation icons
  console.log('\n🧭 Testing Navigation Icons:');
  navigationIcons.forEach((iconName) => {
    const icon = getIconByName(iconName);
    if (icon) {
      console.log(`✅ ${iconName.padEnd(20)} → Resolved`);
      passed++;
    } else {
      console.log(`❌ ${iconName.padEnd(20)} → NOT FOUND`);
      failed++;
    }
  });

  // Cache statistics
  const cacheStats = getIconCacheStats();
  console.log('\n💾 Cache Statistics:');
  console.log(`   Total cached icons: ${cacheStats.size}`);
  console.log(`   Cached entries: ${cacheStats.entries.join(', ')}`);

  // Summary
  console.log('\n📈 Test Summary:');
  console.log(`   ✅ Passed: ${passed}`);
  console.log(`   ❌ Failed: ${failed}`);
  console.log(`   📊 Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);
  console.log('\n' + '━'.repeat(60));

  return { passed, failed, total: passed + failed };
};

// Run test if executed directly
if (typeof window !== 'undefined') {
  (window as any).testIcons = testIconResolution;
  console.log('💡 Run testIcons() in console to test icon system');
}
