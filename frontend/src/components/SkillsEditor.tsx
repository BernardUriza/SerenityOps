import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  IconButton,
  Chip
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';

interface SkillsEditorProps {
  skills: any;
  onChange: (skills: any) => void;
}

const SkillsEditor: React.FC<SkillsEditorProps> = ({ skills, onChange }) => {
  const handleLanguageUpdate = (index: number, field: string, value: any) => {
    const updated = { ...skills };
    updated.languages[index] = { ...updated.languages[index], [field]: value };
    onChange(updated);
  };

  const handleAddLanguage = () => {
    onChange({
      ...skills,
      languages: [...skills.languages, { name: '', proficiency: '', years: 0 }]
    });
  };

  const handleDeleteLanguage = (index: number) => {
    onChange({
      ...skills,
      languages: skills.languages.filter((_: any, i: number) => i !== index)
    });
  };

  const handleDatabaseUpdate = (index: number, field: string, value: any) => {
    const updated = { ...skills };
    updated.databases[index] = { ...updated.databases[index], [field]: value };
    onChange(updated);
  };

  const handleAddDatabase = () => {
    onChange({
      ...skills,
      databases: [...skills.databases, { name: '', proficiency: '' }]
    });
  };

  const handleDeleteDatabase = (index: number) => {
    onChange({
      ...skills,
      databases: skills.databases.filter((_: any, i: number) => i !== index)
    });
  };

  const handleListChange = (field: string, value: string) => {
    onChange({
      ...skills,
      [field]: value.split(',').map(item => item.trim()).filter(item => item)
    });
  };

  const handleFrameworksChange = (category: string, value: string) => {
    onChange({
      ...skills,
      frameworks: {
        ...skills.frameworks,
        [category]: value.split(',').map(item => item.trim()).filter(item => item)
      }
    });
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Skills
      </Typography>

      {/* Programming Languages */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">Programming Languages</Typography>
            <Button size="small" startIcon={<Add />} onClick={handleAddLanguage}>
              Add Language
            </Button>
          </Box>

          {skills.languages?.map((lang: any, index: number) => (
            <Grid container spacing={2} key={index} sx={{ mb: 2 }}>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  size="small"
                  label="Language"
                  value={lang.name || ''}
                  onChange={(e) => handleLanguageUpdate(index, 'name', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  size="small"
                  label="Proficiency"
                  value={lang.proficiency || ''}
                  onChange={(e) => handleLanguageUpdate(index, 'proficiency', e.target.value)}
                  placeholder="beginner/intermediate/advanced/expert"
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  size="small"
                  type="number"
                  label="Years"
                  value={lang.years || ''}
                  onChange={(e) => handleLanguageUpdate(index, 'years', parseInt(e.target.value))}
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <IconButton onClick={() => handleDeleteLanguage(index)}>
                  <Delete />
                </IconButton>
              </Grid>
            </Grid>
          ))}
        </CardContent>
      </Card>

      {/* Frameworks */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Frameworks
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Backend Frameworks (comma-separated)"
                value={skills.frameworks?.backend?.join(', ') || ''}
                onChange={(e) => handleFrameworksChange('backend', e.target.value)}
                helperText="e.g., .NET Core, ASP.NET, Entity Framework"
              />
              <Box mt={1}>
                {skills.frameworks?.backend?.map((fw: string, i: number) => (
                  <Chip key={i} label={fw} size="small" sx={{ mr: 0.5, mb: 0.5 }} />
                ))}
              </Box>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Frontend Frameworks (comma-separated)"
                value={skills.frameworks?.frontend?.join(', ') || ''}
                onChange={(e) => handleFrameworksChange('frontend', e.target.value)}
                helperText="e.g., React, Angular, Next.js"
              />
              <Box mt={1}>
                {skills.frameworks?.frontend?.map((fw: string, i: number) => (
                  <Chip key={i} label={fw} size="small" sx={{ mr: 0.5, mb: 0.5 }} />
                ))}
              </Box>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Mobile Frameworks (comma-separated)"
                value={skills.frameworks?.mobile?.join(', ') || ''}
                onChange={(e) => handleFrameworksChange('mobile', e.target.value)}
                helperText="e.g., Ionic Framework, React Native"
              />
              <Box mt={1}>
                {skills.frameworks?.mobile?.map((fw: string, i: number) => (
                  <Chip key={i} label={fw} size="small" sx={{ mr: 0.5, mb: 0.5 }} />
                ))}
              </Box>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="UI Libraries (comma-separated)"
                value={skills.frameworks?.ui?.join(', ') || ''}
                onChange={(e) => handleFrameworksChange('ui', e.target.value)}
                helperText="e.g., Bootstrap, Material-UI, DevExpress"
              />
              <Box mt={1}>
                {skills.frameworks?.ui?.map((fw: string, i: number) => (
                  <Chip key={i} label={fw} size="small" sx={{ mr: 0.5, mb: 0.5 }} />
                ))}
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Databases */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">Databases</Typography>
            <Button size="small" startIcon={<Add />} onClick={handleAddDatabase}>
              Add Database
            </Button>
          </Box>

          {skills.databases?.map((db: any, index: number) => (
            <Grid container spacing={2} key={index} sx={{ mb: 2 }}>
              <Grid item xs={12} md={5}>
                <TextField
                  fullWidth
                  size="small"
                  label="Database"
                  value={db.name || ''}
                  onChange={(e) => handleDatabaseUpdate(index, 'name', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={5}>
                <TextField
                  fullWidth
                  size="small"
                  label="Proficiency"
                  value={db.proficiency || ''}
                  onChange={(e) => handleDatabaseUpdate(index, 'proficiency', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <IconButton onClick={() => handleDeleteDatabase(index)}>
                  <Delete />
                </IconButton>
              </Grid>
            </Grid>
          ))}
        </CardContent>
      </Card>

      {/* Cloud & DevOps */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Cloud & DevOps
          </Typography>
          <TextField
            fullWidth
            label="Cloud & DevOps Tools (comma-separated)"
            value={skills.cloud_devops?.join(', ') || ''}
            onChange={(e) => handleListChange('cloud_devops', e.target.value)}
            helperText="e.g., Azure, AWS, Docker, Kubernetes, GitLab CI/CD"
          />
          <Box mt={1}>
            {skills.cloud_devops?.map((tool: string, i: number) => (
              <Chip key={i} label={tool} size="small" sx={{ mr: 0.5, mb: 0.5 }} />
            ))}
          </Box>
        </CardContent>
      </Card>

      {/* Tools */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Tools
          </Typography>
          <TextField
            fullWidth
            label="Development Tools (comma-separated)"
            value={skills.tools?.join(', ') || ''}
            onChange={(e) => handleListChange('tools', e.target.value)}
            helperText="e.g., Git, Visual Studio, VS Code"
          />
          <Box mt={1}>
            {skills.tools?.map((tool: string, i: number) => (
              <Chip key={i} label={tool} size="small" sx={{ mr: 0.5, mb: 0.5 }} />
            ))}
          </Box>
        </CardContent>
      </Card>

      {/* Domain Expertise */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Domain Expertise
          </Typography>
          <TextField
            fullWidth
            label="Domain Areas (comma-separated)"
            value={skills.domain_expertise?.join(', ') || ''}
            onChange={(e) => handleListChange('domain_expertise', e.target.value)}
            helperText="e.g., Finance, Real Estate Technology, Supply Chain"
          />
          <Box mt={1}>
            {skills.domain_expertise?.map((domain: string, i: number) => (
              <Chip key={i} label={domain} size="small" sx={{ mr: 0.5, mb: 0.5 }} />
            ))}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default SkillsEditor;
