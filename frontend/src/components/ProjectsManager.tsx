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

interface ProjectsManagerProps {
  projects: any[];
  onChange: (projects: any[]) => void;
}

const ProjectsManager: React.FC<ProjectsManagerProps> = ({ projects, onChange }) => {
  const handleUpdate = (index: number, field: string, value: any) => {
    const updated = [...projects];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const handleAddProject = () => {
    onChange([
      ...projects,
      {
        name: '',
        tagline: '',
        description: '',
        role: '',
        tech_stack: [],
        achievements: []
      }
    ]);
  };

  const handleDelete = (index: number) => {
    onChange(projects.filter((_, i) => i !== index));
  };

  const handleAchievementChange = (projIndex: number, achIndex: number, value: string) => {
    const updated = [...projects];
    updated[projIndex].achievements[achIndex] = value;
    onChange(updated);
  };

  const handleAddAchievement = (projIndex: number) => {
    const updated = [...projects];
    updated[projIndex].achievements.push('');
    onChange(updated);
  };

  const handleTechStackChange = (projIndex: number, value: string) => {
    const updated = [...projects];
    updated[projIndex].tech_stack = value.split(',').map(t => t.trim()).filter(t => t);
    onChange(updated);
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Projects</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={handleAddProject}>
          Add Project
        </Button>
      </Box>

      {projects.map((project, index) => (
        <Card key={index} sx={{ mb: 3 }}>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">Project {index + 1}</Typography>
              <IconButton color="error" onClick={() => handleDelete(index)}>
                <Delete />
              </IconButton>
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Project Name"
                  value={project.name || ''}
                  onChange={(e) => handleUpdate(index, 'name', e.target.value)}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Role"
                  value={project.role || ''}
                  onChange={(e) => handleUpdate(index, 'role', e.target.value)}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Tagline"
                  value={project.tagline || ''}
                  onChange={(e) => handleUpdate(index, 'tagline', e.target.value)}
                  helperText="Short catchy description"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Description"
                  value={project.description || ''}
                  onChange={(e) => handleUpdate(index, 'description', e.target.value)}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom>
                  Achievements
                </Typography>
                {project.achievements?.map((achievement: string, achIndex: number) => (
                  <Box key={achIndex} display="flex" gap={1} mb={1}>
                    <TextField
                      fullWidth
                      size="small"
                      value={achievement}
                      onChange={(e) => handleAchievementChange(index, achIndex, e.target.value)}
                      placeholder="Achievement description"
                    />
                    <IconButton
                      size="small"
                      onClick={() => {
                        const updated = [...projects];
                        updated[index].achievements.splice(achIndex, 1);
                        onChange(updated);
                      }}
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                ))}
                <Button size="small" onClick={() => handleAddAchievement(index)}>
                  Add Achievement
                </Button>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Tech Stack (comma-separated)"
                  value={project.tech_stack?.join(', ') || ''}
                  onChange={(e) => handleTechStackChange(index, e.target.value)}
                  helperText="e.g., .NET Core, React, Azure"
                />
                <Box mt={1}>
                  {project.tech_stack?.map((tech: string, i: number) => (
                    <Chip key={i} label={tech} size="small" sx={{ mr: 0.5, mb: 0.5 }} />
                  ))}
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default ProjectsManager;
