import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import PropTypes from 'prop-types';
import ArrowTopRightOnSquareIcon from '@heroicons/react/24/solid/ArrowTopRightOnSquareIcon';
import ChevronUpDownIcon from '@heroicons/react/24/solid/ChevronUpDownIcon';
import { ChevronRight, ChevronLeft } from '@mui/icons-material';
import {
  Box,
  Button,
  Divider,
  Drawer,
  Stack,
  SvgIcon,
  Typography,
  useMediaQuery
} from '@mui/material';
import { Logo } from 'src/components/logo';
import { Scrollbar } from 'src/components/scrollbar';
import { items } from './config';
import { SideNavItem } from './side-nav-item';
import { useState } from 'react';

export const SideNav = (props) => {
  // const [ navWidth, setNavWidth ] = useState(280)
  const [ nameHide, setNameHide ] = useState(false)
  const { open, onClose } = props;
  const pathname = usePathname();
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));

  function toggleNavWidth() {
    if (props.navWidth == 280) {
      props.setNavWidth(80)
      setNameHide(true)
    }
    else {
      props.setNavWidth(280)
      setNameHide(false)
    }
  }

  const content = (
    <Scrollbar
      sx={{
        height: '100%',
        '& .simplebar-content': {
          height: '100%'
        },
        '& .simplebar-scrollbar:before': {
          background: 'neutral.400'
        }
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%'
        }}
      >
        <Box
          sx={{ 
            p: 3,
            display: 'flex' 
          }}
        >
          <Box
            component={NextLink}
            href="/"
            sx={{
              display: 'inline-flex',
              height: 32,
              width: 32
            }}
          >
            <Logo />
          </Box>
          {
            !nameHide && (
              <Box
                sx={{
                  mt: 0,
                  ml: 3,
                  fontSize: '20px'
                }}
              >
                NLP-Powered BI
              </Box>
            )
          }
        </Box>
        <Divider sx={{ borderColor: 'neutral.700' }} />
        <Box
          component="nav"
          sx={{
            flexGrow: 1,
            px: 2,
            py: 3
          }}
        >
          <Stack
            component="ul"
            spacing={0.5}
            sx={{
              listStyle: 'none',
              p: 0,
              m: 0
            }}
          >
            {items.map((item) => {
              const active = item.path ? (pathname === item.path) : false;

              return (
                <SideNavItem
                  active={active}
                  disabled={item.disabled}
                  external={item.external}
                  icon={item.icon}
                  key={item.title}
                  path={item.path}
                  title={item.title}
                  nameHide={nameHide}
                />
              );
            })}
          </Stack>
        </Box>
        {
              !nameHide && (
                <Box
                  sx={{
                    alignItems: 'center',
                    backgroundColor: 'rgba(255, 255, 255, 0.04)',
                    borderRadius: 1,
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'center',
                    mt: 2,
                    mx: 2,
                    p: '12px'
                  }}
                >
                  <div>
                    <Typography
                      color="inherit"
                      variant="subtitle1"
                    >
                      Powered By Keystone
                    </Typography>
                  </div>
                </Box>
              )
            }
            <Box
              component="span"
              sx={{
                alignItems: 'center',
                display: 'inline-flex',
                justifyContent: 'center'
              }}
            >
              <Button variant="text" style={{margin: '10px', width: '100vw' }} onClick={toggleNavWidth} >
                {nameHide ?
                  (<ChevronRight />) :
                  (<ChevronLeft />)
                }
              </Button>
            </Box>
        <Divider sx={{ borderColor: 'neutral.700' }} />
        
      </Box>
    </Scrollbar>
  );

  if (lgUp) {
    return (
      <Drawer
        anchor="left"
        open
        PaperProps={{
          sx: {
            backgroundColor: 'neutral.800',
            color: 'common.white',
            width: props.navWidth
          }
        }}
        variant="permanent"
      >
        {content}
      </Drawer>
    );
  }

  return (
    <Drawer
      anchor="left"
      onClose={onClose}
      open={open}
      PaperProps={{
        sx: {
          backgroundColor: 'neutral.800',
          color: 'common.white',
          width: 280
        }
      }}
      sx={{ zIndex: (theme) => theme.zIndex.appBar + 100 }}
      variant="temporary"
    >
      {content}
    </Drawer>
  );
};

SideNav.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool
};
