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
  Chip,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';

interface ExperienceListProps {
  experiences: any[];
  onChange: (experiences: any[]) => void;
}

const ExperienceList: React.FC<ExperienceListProps> = ({ experiences, onChange }) => {
  const handleUpdate = (index: number, field: string, value: any) => {
    const updated = [...experiences];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const handleAddExperience = () => {
    onChange([
      ...experiences,
      {
        company: '',
        role: '',
        location: '',
        start_date: '',
        end_date: null,
        current: true,
        description: '',
        achievements: [],
        tech_stack: []
      }
    ]);
  };

  const handleDelete = (index: number) => {
    onChange(experiences.filter((_, i) => i !== index));
  };

  const handleAchievementChange = (expIndex: number, achIndex: number, value: string) => {
    const updated = [...experiences];
    updated[expIndex].achievements[achIndex] = value;
    onChange(updated);
  };

  const handleAddAchievement = (expIndex: number) => {
    const updated = [...experiences];
    updated[expIndex].achievements.push('');
    onChange(updated);
  };

  const handleTechStackChange = (expIndex: number, value: string) => {
    const updated = [...experiences];
    updated[expIndex].tech_stack = value.split(',').map(t => t.trim()).filter(t => t);
    onChange(updated);
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Work Experience</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={handleAddExperience}>
          Add Experience
        </Button>
      </Box>

      {experiences.map((exp, index) => (
        <Card key={index} sx={{ mb: 3 }}>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">Experience {index + 1}</Typography>
              <IconButton color="error" onClick={() => handleDelete(index)}>
                <Delete />
              </IconButton>
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Company"
                  value={exp.company || ''}
                  onChange={(e) => handleUpdate(index, 'company', e.target.value)}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Role"
                  value={exp.role || ''}
                  onChange={(e) => handleUpdate(index, 'role', e.target.value)}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Location"
                  value={exp.location || ''}
                  onChange={(e) => handleUpdate(index, 'location', e.target.value)}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Start Date"
                  placeholder="YYYY-MM"
                  value={exp.start_date || ''}
                  onChange={(e) => handleUpdate(index, 'start_date', e.target.value)}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="End Date"
                  placeholder="YYYY-MM or leave empty"
                  value={exp.end_date || ''}
                  onChange={(e) => handleUpdate(index, 'end_date', e.target.value || null)}
                  disabled={exp.current}
                />
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={exp.current || false}
                      onChange={(e) => {
                        handleUpdate(index, 'current', e.target.checked);
                        if (e.target.checked) {
                          handleUpdate(index, 'end_date', null);
                        }
                      }}
                    />
                  }
                  label="Currently working here"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Description"
                  value={exp.description || ''}
                  onChange={(e) => handleUpdate(index, 'description', e.target.value)}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom>
                  Achievements
                </Typography>
                {exp.achievements?.map((achievement: string, achIndex: number) => (
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
                        const updated = [...experiences];
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
                  value={exp.tech_stack?.join(', ') || ''}
                  onChange={(e) => handleTechStackChange(index, e.target.value)}
                  helperText="e.g., React, TypeScript, Node.js"
                />
                <Box mt={1}>
                  {exp.tech_stack?.map((tech: string, i: number) => (
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

export default ExperienceList;
