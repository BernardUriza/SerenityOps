/**
 * Icon Showcase Component
 * Demonstrates all available icons and their usage
 * Use this for development and documentation
 */

import React from 'react';
import { Icon, getAllIconNames, EMOJI_TO_ICON_MAP, IconSize, IconCategory, getIconsByCategory } from './index';

export const IconShowcase: React.FC = () => {
  const allIcons = getAllIconNames();

  return (
    <div className="p-8 space-y-12 bg-macBg min-h-screen">
      <div>
        <h1 className="text-3xl font-bold text-gradient mb-2">SerenityOps Icon System</h1>
        <p className="text-macSubtext">Clean Architecture • SOLID • DRY</p>
      </div>

      {/* Size Variants */}
      <section>
        <h2 className="text-xl font-bold text-macText mb-4">Size Variants</h2>
        <div className="flex items-center gap-6 p-6 liquid-glass rounded-2xl">
          <Icon name="rocket" size={IconSize.XS} />
          <Icon name="rocket" size={IconSize.SM} />
          <Icon name="rocket" size={IconSize.MD} />
          <Icon name="rocket" size={IconSize.LG} />
          <Icon name="rocket" size={IconSize.XL} />
          <Icon name="rocket" size={IconSize.XXL} />
        </div>
        <div className="mt-2 text-xs text-macSubtext flex gap-4">
          <span>XS(12)</span>
          <span>SM(16)</span>
          <span>MD(24)</span>
          <span>LG(24)</span>
          <span>XL(32)</span>
          <span>XXL(48)</span>
        </div>
      </section>

      {/* Color Variants */}
      <section>
        <h2 className="text-xl font-bold text-macText mb-4">Color Variants</h2>
        <div className="flex items-center gap-4 p-6 liquid-glass rounded-2xl">
          <Icon name="target" size={32} color="text-macAccent" />
          <Icon name="target" size={32} color="text-purple-500" />
          <Icon name="target" size={32} color="text-cyan-500" />
          <Icon name="target" size={32} color="text-success" />
          <Icon name="target" size={32} color="text-error" />
          <Icon name="target" size={32} color="text-amber-500" />
        </div>
      </section>

      {/* All Icons Grid */}
      <section>
        <h2 className="text-xl font-bold text-macText mb-4">All Icons ({allIcons.length})</h2>
        <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
          {allIcons.map((iconName) => (
            <div
              key={iconName}
              className="flex flex-col items-center gap-2 p-4 liquid-glass rounded-xl hover-lift transition-all duration-300 group cursor-pointer"
            >
              <Icon name={iconName} size={32} className="group-hover:scale-110 transition-transform" />
              <span className="text-[10px] text-macSubtext text-center font-medium">{iconName}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Icons by Category */}
      <section>
        <h2 className="text-xl font-bold text-macText mb-4">Business Icons</h2>
        <div className="flex flex-wrap gap-4">
          {getIconsByCategory(IconCategory.BUSINESS).map((icon) => (
            <div
              key={icon.name}
              className="flex items-center gap-3 px-4 py-3 liquid-glass rounded-xl"
            >
              <Icon name={icon.name} size={24} />
              <span className="text-sm text-macText font-medium">{icon.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Emoji Replacement Map */}
      <section>
        <h2 className="text-xl font-bold text-macText mb-4">Emoji → Icon Mapping</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Object.entries(EMOJI_TO_ICON_MAP).map(([emoji, iconName]) => (
            <div
              key={emoji}
              className="flex items-center gap-4 p-4 liquid-glass rounded-xl"
            >
              <span className="text-2xl">{emoji}</span>
              <span className="text-xl text-macSubtext">→</span>
              <Icon name={iconName} size={24} />
              <span className="text-xs text-macSubtext">{iconName}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Usage Examples */}
      <section>
        <h2 className="text-xl font-bold text-macText mb-4">Usage Examples</h2>
        <div className="space-y-4">
          {/* Example 1: With Text */}
          <div className="p-6 liquid-glass rounded-xl">
            <h3 className="text-sm font-semibold text-macSubtext mb-3">With Text</h3>
            <div className="flex items-center gap-2">
              <Icon name="rocket" size={20} color="text-purple-500" />
              <span className="text-macText font-medium">Launch Project</span>
            </div>
          </div>

          {/* Example 2: In Button */}
          <div className="p-6 liquid-glass rounded-xl">
            <h3 className="text-sm font-semibold text-macSubtext mb-3">In Button</h3>
            <button className="flex items-center gap-2 px-4 py-3 gradient-accent text-white rounded-xl font-semibold">
              <Icon name="briefcase" size={20} />
              <span>View Opportunities</span>
            </button>
          </div>

          {/* Example 3: Status Badge */}
          <div className="p-6 liquid-glass rounded-xl">
            <h3 className="text-sm font-semibold text-macSubtext mb-3">Status Badge</h3>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-success/10 border border-success/30 rounded-lg">
              <Icon name="check-circle" size={16} color="text-success" />
              <span className="text-success font-semibold text-sm">Completed</span>
            </div>
          </div>

          {/* Example 4: Card Header */}
          <div className="p-6 liquid-glass rounded-xl">
            <h3 className="text-sm font-semibold text-macSubtext mb-3">Card Header</h3>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl gradient-accent-subtle flex items-center justify-center shadow-lg">
                <Icon name="trophy" size={28} color="text-macAccent" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-macText">Achievements</h4>
                <p className="text-sm text-macSubtext">Track your career milestones</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Code Examples */}
      <section>
        <h2 className="text-xl font-bold text-macText mb-4">Code Examples</h2>
        <div className="space-y-4">
          <div className="p-4 bg-macPanel/50 rounded-xl font-mono text-xs">
            <div className="text-macSubtext mb-2">// Basic usage</div>
            <div className="text-cyan-400">&lt;Icon <span className="text-amber-400">name</span>=<span className="text-green-400">"rocket"</span> /&gt;</div>
          </div>

          <div className="p-4 bg-macPanel/50 rounded-xl font-mono text-xs">
            <div className="text-macSubtext mb-2">// With custom props</div>
            <div className="text-cyan-400">
              &lt;Icon
              <br />
              <span className="ml-4"><span className="text-amber-400">name</span>=<span className="text-green-400">"briefcase"</span></span>
              <br />
              <span className="ml-4"><span className="text-amber-400">size</span>={'{'}32{'}'}</span>
              <br />
              <span className="ml-4"><span className="text-amber-400">color</span>=<span className="text-green-400">"text-purple-500"</span></span>
              <br />
              <span className="ml-4"><span className="text-amber-400">className</span>=<span className="text-green-400">"hover:scale-110"</span></span>
              <br />
              /&gt;
            </div>
          </div>

          <div className="p-4 bg-macPanel/50 rounded-xl font-mono text-xs">
            <div className="text-macSubtext mb-2">// Direct component import</div>
            <div className="text-purple-400">import</div> {' { '}
            <span className="text-cyan-400">RocketIcon</span> {' } '}
            <div className="text-purple-400">from</div> <span className="text-green-400">'@/icons'</span>
            <br />
            <br />
            <div className="text-cyan-400">&lt;RocketIcon <span className="text-amber-400">size</span>={'{'}24{'}'} <span className="text-amber-400">color</span>=<span className="text-green-400">"text-cyan-500"</span> /&gt;</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default IconShowcase;
