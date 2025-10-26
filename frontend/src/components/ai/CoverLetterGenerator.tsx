/**
 * Cover Letter Generator with AI
 *
 * AI-powered cover letter generation with customizable templates
 *
 * Features:
 * - Template selection (Professional, Creative, Technical, Executive)
 * - AI-powered content generation using Claude API
 * - Manual editing capabilities
 * - Preview and export to PDF/DOCX
 * - Save drafts
 * - Company and role auto-fill from opportunities
 *
 * SO-AI-FEAT-002
 */

import React, { useState, useEffect } from 'react';
import { Icon } from '../../icons';

interface CoverLetterTemplate {
  id: string;
  name: string;
  description: string;
  style: 'professional' | 'creative' | 'technical' | 'executive';
  icon: string;
}

interface CoverLetterData {
  recipientName?: string;
  recipientTitle?: string;
  companyName: string;
  position: string;
  yourName: string;
  yourEmail: string;
  yourPhone?: string;
  content: string;
  template: string;
}

interface CoverLetterGeneratorProps {
  apiBaseUrl: string;
}

const TEMPLATES: CoverLetterTemplate[] = [
  {
    id: 'professional',
    name: 'Professional',
    description: 'Classic business format, formal tone',
    style: 'professional',
    icon: 'briefcase'
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Modern design, engaging storytelling',
    style: 'creative',
    icon: 'sparkles'
  },
  {
    id: 'technical',
    name: 'Technical',
    description: 'Skills-focused, data-driven approach',
    style: 'technical',
    icon: 'wrench'
  },
  {
    id: 'executive',
    name: 'Executive',
    description: 'Leadership-focused, strategic vision',
    style: 'executive',
    icon: 'trophy'
  }
];

export const CoverLetterGenerator: React.FC<CoverLetterGeneratorProps> = ({ apiBaseUrl }) => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('professional');
  const [formData, setFormData] = useState<Partial<CoverLetterData>>({
    yourName: '',
    yourEmail: '',
    yourPhone: '',
    companyName: '',
    position: '',
    recipientName: '',
    recipientTitle: '',
    content: ''
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string>('');
  const [showPreview, setShowPreview] = useState(false);
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [selectedOpportunity, setSelectedOpportunity] = useState<string>('');

  useEffect(() => {
    loadOpportunities();
    loadUserProfile();
  }, []);

  const loadOpportunities = async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/api/opportunities`);
      if (response.ok) {
        const data = await response.json();
        setOpportunities(data.pipeline || []);
      }
    } catch (error) {
      console.error('Failed to load opportunities:', error);
    }
  };

  const loadUserProfile = async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/api/curriculum`);
      if (response.ok) {
        const data = await response.json();
        setFormData(prev => ({
          ...prev,
          yourName: data.personal?.name || '',
          yourEmail: data.personal?.email || '',
          yourPhone: data.personal?.phone || ''
        }));
      }
    } catch (error) {
      console.error('Failed to load profile:', error);
    }
  };

  const handleOpportunitySelect = (oppId: string) => {
    setSelectedOpportunity(oppId);
    const opp = opportunities.find(o => o.id === oppId);
    if (opp) {
      setFormData(prev => ({
        ...prev,
        companyName: opp.company,
        position: opp.role
      }));
    }
  };

  const handleGenerateWithAI = async () => {
    if (!formData.companyName || !formData.position) {
      alert('Please fill in company name and position');
      return;
    }

    setIsGenerating(true);

    try {
      const response = await fetch(`${apiBaseUrl}/api/ai/cover-letter`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          template: selectedTemplate,
          companyName: formData.companyName,
          position: formData.position,
          recipientName: formData.recipientName,
          recipientTitle: formData.recipientTitle
        })
      });

      if (!response.ok) {
        throw new Error('AI generation failed');
      }

      const data = await response.json();
      setGeneratedContent(data.content);
      setFormData(prev => ({ ...prev, content: data.content }));
      setShowPreview(true);
    } catch (error) {
      console.error('AI generation error:', error);
      // Fallback to template
      generateFromTemplate();
    } finally {
      setIsGenerating(false);
    }
  };

  const generateFromTemplate = () => {
    const template = TEMPLATES.find(t => t.id === selectedTemplate);
    const content = `Dear ${formData.recipientName || 'Hiring Manager'},

I am writing to express my strong interest in the ${formData.position} position at ${formData.companyName}. With my background and expertise, I am confident that I would be a valuable addition to your team.

[Your unique value proposition and relevant experience]

I am particularly drawn to ${formData.companyName} because of [specific reasons why you're interested in this company].

[Highlight 2-3 key achievements or skills relevant to the role]

I would welcome the opportunity to discuss how my skills and experience align with ${formData.companyName}'s needs. Thank you for your consideration.

Sincerely,
${formData.yourName}`;

    setGeneratedContent(content);
    setFormData(prev => ({ ...prev, content }));
    setShowPreview(true);
  };

  const handleExport = async (format: 'pdf' | 'docx') => {
    try {
      const response = await fetch(`${apiBaseUrl}/api/cover-letter/export`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          format,
          template: selectedTemplate
        })
      });

      if (!response.ok) throw new Error('Export failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `cover-letter-${formData.companyName}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Export error:', error);
      alert(`Export failed. Fallback: copy the content and save manually.`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-macText mb-2">Cover Letter Generator</h2>
          <p className="text-macSubtext">Create personalized cover letters with AI assistance</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => handleExport('pdf')}
            disabled={!formData.content}
            className="px-4 py-2 bg-macBgSecondary text-macText rounded-lg border border-macBorder hover:bg-macHover disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Icon name="download" size={16} />
            Export PDF
          </button>
          <button
            onClick={() => handleExport('docx')}
            disabled={!formData.content}
            className="px-4 py-2 bg-macBgSecondary text-macText rounded-lg border border-macBorder hover:bg-macHover disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Icon name="file" size={16} />
            Export DOCX
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Template Selection & Form */}
        <div className="lg:col-span-1 space-y-6">
          {/* Template Selection */}
          <div className="p-6 bg-macBgSecondary rounded-lg border border-macBorder">
            <h3 className="text-lg font-semibold text-macText mb-4">Select Template</h3>
            <div className="space-y-3">
              {TEMPLATES.map(template => (
                <button
                  key={template.id}
                  onClick={() => setSelectedTemplate(template.id)}
                  className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                    selectedTemplate === template.id
                      ? 'border-macAccent bg-macAccent/10'
                      : 'border-macBorder bg-macBg hover:border-macAccent/50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Icon name={template.icon} size={20} className={selectedTemplate === template.id ? 'text-macAccent' : 'text-macSubtext'} />
                    <div className="flex-1">
                      <h4 className="font-semibold text-macText text-sm">{template.name}</h4>
                      <p className="text-xs text-macSubtext mt-1">{template.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Fill from Opportunity */}
          {opportunities.length > 0 && (
            <div className="p-6 bg-macBgSecondary rounded-lg border border-macBorder">
              <h3 className="text-lg font-semibold text-macText mb-4 flex items-center gap-2">
                <Icon name="target" size={20} />
                Quick Fill from Opportunity
              </h3>
              <select
                value={selectedOpportunity}
                onChange={(e) => handleOpportunitySelect(e.target.value)}
                className="w-full px-3 py-2 bg-macBg border border-macBorder rounded-lg text-macText focus:outline-none focus:border-macAccent"
              >
                <option value="">Select an opportunity...</option>
                {opportunities.map(opp => (
                  <option key={opp.id} value={opp.id}>
                    {opp.company} - {opp.role}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Middle Column: Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Form */}
          <div className="p-6 bg-macBgSecondary rounded-lg border border-macBorder">
            <h3 className="text-lg font-semibold text-macText mb-4">Letter Details</h3>
            <div className="space-y-4">
              {/* Your Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-macText mb-2">Your Name *</label>
                  <input
                    type="text"
                    value={formData.yourName || ''}
                    onChange={(e) => setFormData({ ...formData, yourName: e.target.value })}
                    className="w-full px-3 py-2 bg-macBg border border-macBorder rounded-lg text-macText focus:outline-none focus:border-macAccent"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-macText mb-2">Your Email *</label>
                  <input
                    type="email"
                    value={formData.yourEmail || ''}
                    onChange={(e) => setFormData({ ...formData, yourEmail: e.target.value })}
                    className="w-full px-3 py-2 bg-macBg border border-macBorder rounded-lg text-macText focus:outline-none focus:border-macAccent"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              {/* Company Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-macText mb-2">Company Name *</label>
                  <input
                    type="text"
                    value={formData.companyName || ''}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    className="w-full px-3 py-2 bg-macBg border border-macBorder rounded-lg text-macText focus:outline-none focus:border-macAccent"
                    placeholder="Acme Corp"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-macText mb-2">Position *</label>
                  <input
                    type="text"
                    value={formData.position || ''}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    className="w-full px-3 py-2 bg-macBg border border-macBorder rounded-lg text-macText focus:outline-none focus:border-macAccent"
                    placeholder="Senior Software Engineer"
                  />
                </div>
              </div>

              {/* Recipient Info (Optional) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-macText mb-2">Recipient Name</label>
                  <input
                    type="text"
                    value={formData.recipientName || ''}
                    onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                    className="w-full px-3 py-2 bg-macBg border border-macBorder rounded-lg text-macText focus:outline-none focus:border-macAccent"
                    placeholder="Jane Smith (optional)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-macText mb-2">Recipient Title</label>
                  <input
                    type="text"
                    value={formData.recipientTitle || ''}
                    onChange={(e) => setFormData({ ...formData, recipientTitle: e.target.value })}
                    className="w-full px-3 py-2 bg-macBg border border-macBorder rounded-lg text-macText focus:outline-none focus:border-macAccent"
                    placeholder="Hiring Manager (optional)"
                  />
                </div>
              </div>

              {/* Generate Button */}
              <div className="flex gap-3">
                <button
                  onClick={handleGenerateWithAI}
                  disabled={isGenerating || !formData.companyName || !formData.position}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-macAccent to-cyan-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-macAccent/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isGenerating ? (
                    <>
                      <Icon name="loader" size={20} className="animate-spin" />
                      Generating with AI...
                    </>
                  ) : (
                    <>
                      <Icon name="sparkles" size={20} />
                      Generate with AI
                    </>
                  )}
                </button>
                <button
                  onClick={generateFromTemplate}
                  disabled={!formData.companyName || !formData.position}
                  className="px-6 py-3 bg-macBgSecondary text-macText font-semibold rounded-lg border border-macBorder hover:bg-macHover disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Use Template
                </button>
              </div>
            </div>
          </div>

          {/* Content Editor / Preview */}
          {showPreview && (
            <div className="p-6 bg-macBgSecondary rounded-lg border border-macBorder">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-macText">Generated Cover Letter</h3>
                <button
                  onClick={() => setShowPreview(false)}
                  className="text-macSubtext hover:text-macText"
                >
                  <Icon name="x" size={20} />
                </button>
              </div>
              <textarea
                value={formData.content || ''}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full h-96 px-4 py-3 bg-macBg border border-macBorder rounded-lg text-macText font-mono text-sm focus:outline-none focus:border-macAccent resize-none"
                placeholder="Your cover letter will appear here..."
              />
              <p className="text-xs text-macSubtext mt-2">
                ✏️ You can edit the generated content directly
              </p>
            </div>
          )}

          {/* Info Card */}
          {!showPreview && (
            <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-start gap-3">
                <Icon name="lightbulb" size={24} className="text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Tips for Great Cover Letters</h3>
                  <ul className="space-y-1 text-sm text-blue-800 dark:text-blue-200">
                    <li>• Customize each letter for the specific role and company</li>
                    <li>• Highlight relevant achievements with concrete examples</li>
                    <li>• Show enthusiasm for the company and position</li>
                    <li>• Keep it concise - aim for 3-4 paragraphs</li>
                    <li>• Proofread carefully before sending</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
