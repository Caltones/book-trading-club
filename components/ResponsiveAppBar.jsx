import { useEffect, useState } from 'react';
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
import BookTwoToneIcon from '@mui/icons-material/BookTwoTone';
import  Badge  from '@mui/material/Badge';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function ResponsiveAppBar({
  session,
  signIn,
  pfp,
  name,
  signOut,
}) {
  useEffect(()=>{
    fetch(`/api/user/requests/${name}`).then((async val=> await val.json()))
    .then(res=>setNoti(res.length))
  },[name])
  const pages = ['users', 'create'];
  const settings = ['Requests', 'Logout'];
  const router = useRouter()
  const [noti,setNoti] = useState(0)
  const [anchorElNav, setAnchorElNav] = useState('');
  const [anchorElUser, setAnchorElUser] = useState('');
  const handleOpenNavMenu = (e) => {
    setAnchorElNav(e.currentTarget);
  };
  const handleOpenUserMenu = (e) => {
    setAnchorElUser(e.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav('');
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser('');
  };
  const settingHandler = (e)=>{
    if(e.target.textContent==='Logout'){
      signOut({ callbackUrl: 'http://localhost:3000' })
    }else{
      router.push(`/requests`)
    }
    

  }
  return (
    <AppBar position="sticky">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Link href="/">
            <BookTwoToneIcon
              sx={{
                display: { xs: 'none', md: 'flex' },
                mr: 1,
                cursor: 'pointer',
              }}
              fontSize="large"
            />
          </Link>

          <Link
            href="/"
            style={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
              cursor: 'pointer',
            }}
          >
            Book
          </Link>

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
              {pages.map((page) => (
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <Link
                    href={
                      session
                        ? `/${page}`
                        : '/api/auth/signin?callbackUrl=http%3A%2F%2Flocalhost%3A3000%2F'
                    }
                  >
                    {page}
                  </Link>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <BookTwoToneIcon
            sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }}
          />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href=""
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Book
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                <Link href={`/${page}`}>{page}</Link>
              </Button>
            ))}
          </Box>
          {session === null ? (
            <Box sx={{ flexGrow: 0 }}>
              <Button
                sx={{ my: 2, color: 'white', display: 'block' }}
                onClick={signIn}
              >
                signIn
              </Button>
            </Box>
          ) : (
            <>
              <Link href={`/user/${name}`}>
                <Typography sx={{ cursor: 'pointer' }}>{name}</Typography>
              </Link>
              <Box sx={{ ml: 2, flexGrow: 0 }}>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Badge
                      color="info"
                      overlap="circular"
                      badgeContent={noti}
                    >
                      <Avatar alt={name} src={pfp} />
                    </Badge>
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
                      <Button onClick={settingHandler}>{setting}</Button>
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
            </>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}
