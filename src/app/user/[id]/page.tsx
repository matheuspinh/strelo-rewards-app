'use client';

import { Box, Container, Typography } from "@mui/material";

export default function Page() {

  return (
    <Container maxWidth='xl'>
      <Typography variant="h4"> USER PROFILE</Typography>
      <Box
        sx={{
          mt: 5,
          width: 1,
          height: 320,
          borderRadius: 2,
        }}
      />
    </Container>
  );
}