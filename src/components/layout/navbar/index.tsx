import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import { Divider, FormControlLabel, FormGroup, Switch } from '@mui/material';
import Link from 'next/link';
import { AccountCircle, Home, MoreVert } from '@mui/icons-material';
import { height } from '@mui/system';
import Image from 'next/image';

const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

const NavBar = () => {
  const [auth, setAuth] = React.useState(true);
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAuth(event.target.checked);
  };

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <Box>
      {/* <FormGroup>
        <FormControlLabel
          control={
            <Switch
              checked={auth}
              onChange={handleChange}
              aria-label="login switch"
            />
          }
          label={auth ? 'Logout' : 'Login'}
        />
      </FormGroup> */}
      <AppBar position="static" >
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Box sx={{marginRight:{xs:'0px',md:'50px',lg:'125px'},marginLeft:{xs:'0px',md:'50px',lg:'125px'}}}>
              
              <Link href={'/'}>
                <img src={'/OPAL_White Transparent.png'} 
                  alt='OPAL'  
                  height={63}
                  width={166}
                />
              </Link>

            </Box>

            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: 'block', md: 'none' },
                }}
              >
                <Link href="/">
                  <MenuItem key={'Dataland'}>
                      {/* <Typography textAlign="center">{'Dataland'}</Typography> */}
                      <Button endIcon={<Home/>}
                      sx={{ my: 2, color: 'black' }}
                >
                </Button>
                  </MenuItem>
                </Link>
                <Link href="/">
                  <MenuItem key={'Dataland'}>
                      <Typography textAlign="center">{'Dataland'}</Typography>
                  </MenuItem>
                </Link>
                
              </Menu>
            </Box>
            
            <Box id="destock-menu" sx={{ flexGrow: 1,display: { xs: 'none', md: 'flex' },alignItems:'center',height:{md:'50px'} }}>
              <Link href={'/'}>
                <Button endIcon={<Home/>}
                      sx={{ my: 2, color: 'white'}}
                >
                </Button>
                
              </Link>
              <Divider orientation='vertical' variant='middle' sx={{border:'solid .5px white',opacity:'.5',height:'25px'}}/>
              <Link href={'/'}>
                <Button
                      key={'Dataland'}
                      sx={{ my: 2, color: 'white' }}
                    >
                      Dataland
                    </Button>
              </Link>
              {/* <Link href={'/district'}>
                <Button
                      key={'Districts'}
                      sx={{ my: 2, color: 'white', display: 'block' }}
                    >
                      Districts
                    </Button>
              </Link>
              <Link href={'/neighborhood'}>
                <Button
                      key={'Neighborhoods'}
                      sx={{ my: 2, color: 'white', display: 'block' }}
                    >
                      Neighborhoods
                    </Button>
              </Link> */}
              
            </Box>

            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <>
                  <MoreVert sx={{color:'white'}}/>
                  <AccountCircle sx={{color:'white'}}/>
                  </>
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting) => (
                  <MenuItem key={setting} onClick={handleCloseUserMenu}>
                    <Typography textAlign="center">{setting}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </Box>
  );
};
export default NavBar;
