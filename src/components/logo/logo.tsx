import { forwardRef } from 'react';

import Link from '@mui/material/Link';
import { useTheme } from '@mui/material/styles';
import Box, { BoxProps } from '@mui/material/Box';

import { RouterLink } from 'src/routes/components';

// ----------------------------------------------------------------------

export interface LogoProps extends BoxProps {
  disabledLink?: boolean;
}

const Logo = forwardRef<HTMLDivElement, LogoProps>(
  ({ disabledLink = false, sx, ...other }, ref) => {
    const theme = useTheme();

    const PRIMARY_LIGHT = theme.palette.primary.light;

    const PRIMARY_MAIN = theme.palette.primary.main;

    const PRIMARY_DARK = theme.palette.primary.dark;

    // OR using local (public folder)
    // -------------------------------------------------------
    // const logo = (
    //   <Box
    //     component="img"
    //     src="/logo/logo_single.svg" => your path
    //     sx={{ width: 40, height: 40, cursor: 'pointer', ...sx }}
    //   />
    // );

    const logo = (
      <Box
        ref={ref}
        component="div"
        sx={{
          width: 40,
          height: 40,
          display: 'inline-flex',
          ...sx,
        }}
        {...other}
      >
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M10.3726 7.70097C7.02007 8.49893 4.96545 10.4815 3.94338 13.6501C2.79923 16.4568 2.69792 25.5382 3.94338 28.6321C5.09143 31.3721 6.85619 33.3805 10.3726 34.4071C12.3206 34.9758 16.2241 35.2409 20.0407 35.2343C23.8487 35.24 27.7388 34.9744 29.6822 34.407C33.1987 33.3804 35.0442 31.4304 36.1115 28.6321C37.1787 25.8338 37.4089 16.818 36.1115 13.6501C35.0894 10.4814 33.0348 8.49889 29.6822 7.70092C27.427 7.16413 23.6771 6.83809 20.0254 6.87834C16.375 6.83826 12.627 7.16438 10.3726 7.70097ZM20.0169 29.3519C16.5547 29.3519 13.1233 29.0264 12.0755 28.8021C9.21678 28.1902 7.31798 27.0924 6.43933 25.0129C5.80783 23.5183 5.53925 21.5656 5.60778 19.2502C5.66783 17.2214 6.00465 15.155 6.43933 13.749C7.1775 11.3612 9.23829 10.0728 12.0755 9.70019C15.6631 9.22898 19.3078 9.17082 20.0281 9.17033C22.6319 9.16853 25.2522 9.34018 27.9971 9.70014C30.8386 10.0728 32.9026 11.3612 33.6419 13.7489C34.0772 15.155 34.4145 17.2213 34.4746 19.2502C34.5433 21.5656 34.267 23.8321 33.6419 25.0128C32.2954 27.5563 30.8602 28.1902 27.9971 28.8021C26.945 29.0269 23.4935 29.3525 20.0169 29.3519Z" fill="#222222"/>
          <path d="M11.4116 16.4533L12.6561 15.0908L16.8809 19.2064L12.6561 23.3221L11.4116 22.0986L14.323 19.1591L11.4116 16.4533Z" fill="#222222"/>
          <path d="M27.4727 15.4092H25.7745V22.9583H27.4727V15.4092Z" fill="#222222"/>
        </svg>
      </Box>
    );

    if (disabledLink) {
      return logo;
    }

    return (
      <Link component={RouterLink} href="/" sx={{ display: 'contents' }}>
        {logo}
      </Link>
    );
  }
);

export default Logo;
