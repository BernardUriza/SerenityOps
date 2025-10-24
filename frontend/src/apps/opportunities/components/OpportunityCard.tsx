// OpportunityCard - Simple card component (placeholder)
import React from 'react';
import type { Opportunity } from '../types';

interface OpportunityCardProps {
  opportunity: Opportunity;
}

const OpportunityCard: React.FC<OpportunityCardProps> = ({ opportunity }) => {
  return (
    <div className="liquid-glass rounded-xl p-6 border border-macBorder/30">
      <h3 className="text-lg font-bold text-macText mb-2">{opportunity.company}</h3>
      <p className="text-sm text-macSubtext">{opportunity.role}</p>
    </div>
  );
};

export default OpportunityCard;
