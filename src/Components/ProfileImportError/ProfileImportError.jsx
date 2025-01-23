import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  CircularProgress,
} from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

const ProfileImportErrors = ({ errors }) => {
  return (
    <Card>
      <CardContent>
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <ErrorOutlineIcon color="error" fontSize="large" />
          <Typography variant="h6">Profile Import Errors</Typography>
        </Box>

        <Typography variant="subtitle1" color="error" gutterBottom>
          {errors.length} profiles failed to import
        </Typography>

        <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Profile URL</TableCell>
                <TableCell>Error Reason</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {errors.map((error, index) => (
                <TableRow key={index} hover>
                  <TableCell>{error.url}</TableCell>
                  <TableCell>{error.error}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};

export default ProfileImportErrors;

export const ProfileImportLoader = ({ totalProfiles }) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100%"
      p={4}
    >
      <CircularProgress size={60} />
      <Typography variant="h6" mt={2}>
        Importing Profiles
      </Typography>
      <Typography variant="body2" color="textSecondary">
        Please wait while importing {totalProfiles} profiles...
      </Typography>
    </Box>
  );
};
