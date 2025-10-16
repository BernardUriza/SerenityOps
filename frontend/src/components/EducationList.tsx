import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  IconButton
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';

interface EducationListProps {
  education: any[];
  languages: any[];
  certifications: any[];
  onChange: (field: string, value: any) => void;
}

const EducationList: React.FC<EducationListProps> = ({
  education,
  languages,
  certifications,
  onChange
}) => {
  const handleEducationUpdate = (index: number, field: string, value: any) => {
    const updated = [...education];
    updated[index] = { ...updated[index], [field]: value };
    onChange('education', updated);
  };

  const handleAddEducation = () => {
    onChange('education', [
      ...education,
      {
        institution: '',
        degree: '',
        field: '',
        start_date: '',
        end_date: '',
        status: 'completed'
      }
    ]);
  };

  const handleDeleteEducation = (index: number) => {
    onChange('education', education.filter((_, i) => i !== index));
  };

  const handleLanguageUpdate = (index: number, field: string, value: any) => {
    const updated = [...languages];
    updated[index] = { ...updated[index], [field]: value };
    onChange('languages', updated);
  };

  const handleAddLanguage = () => {
    onChange('languages', [
      ...languages,
      { name: '', proficiency: '' }
    ]);
  };

  const handleDeleteLanguage = (index: number) => {
    onChange('languages', languages.filter((_, i) => i !== index));
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Education & Languages
      </Typography>

      {/* Education */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">Education</Typography>
            <Button size="small" startIcon={<Add />} onClick={handleAddEducation}>
              Add Education
            </Button>
          </Box>

          {education.map((edu, index) => (
            <Card key={index} variant="outlined" sx={{ mb: 2, p: 2 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="subtitle1">Education {index + 1}</Typography>
                <IconButton size="small" onClick={() => handleDeleteEducation(index)}>
                  <Delete />
                </IconButton>
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Institution"
                    value={edu.institution || ''}
                    onChange={(e) => handleEducationUpdate(index, 'institution', e.target.value)}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Degree"
                    value={edu.degree || ''}
                    onChange={(e) => handleEducationUpdate(index, 'degree', e.target.value)}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Field of Study"
                    value={edu.field || ''}
                    onChange={(e) => handleEducationUpdate(index, 'field', e.target.value)}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Start Date"
                    placeholder="YYYY-MM"
                    value={edu.start_date || ''}
                    onChange={(e) => handleEducationUpdate(index, 'start_date', e.target.value)}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="End Date"
                    placeholder="YYYY-MM"
                    value={edu.end_date || ''}
                    onChange={(e) => handleEducationUpdate(index, 'end_date', e.target.value)}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Status"
                    value={edu.status || ''}
                    onChange={(e) => handleEducationUpdate(index, 'status', e.target.value)}
                    helperText="completed, in-progress, etc."
                  />
                </Grid>
              </Grid>
            </Card>
          ))}
        </CardContent>
      </Card>

      {/* Languages */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">Spoken Languages</Typography>
            <Button size="small" startIcon={<Add />} onClick={handleAddLanguage}>
              Add Language
            </Button>
          </Box>

          {languages.map((lang, index) => (
            <Grid container spacing={2} key={index} sx={{ mb: 2 }}>
              <Grid item xs={12} md={5}>
                <TextField
                  fullWidth
                  size="small"
                  label="Language"
                  value={lang.name || ''}
                  onChange={(e) => handleLanguageUpdate(index, 'name', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={5}>
                <TextField
                  fullWidth
                  size="small"
                  label="Proficiency"
                  value={lang.proficiency || ''}
                  onChange={(e) => handleLanguageUpdate(index, 'proficiency', e.target.value)}
                  helperText="native, fluent, professional, etc."
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

      {/* Certifications */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Certifications
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Certifications section coming soon. You can manually edit the YAML for now.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default EducationList;
