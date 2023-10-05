// ** MUI Imports
import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import { Theme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'

const FooterContent = () => {
  // ** Var
  const hidden = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
      <Typography sx={{ mr: 2 }}>
        {`${new Date().getFullYear()}, All In One Project,  v 2.0.0`}
        <Box component='span' sx={{ color: 'error.main' }}>
          ❤️
        </Box>
        {`  `}
        {/* <Link target='_blank' href='https://pixinvent.com/'>
          Pixinvent
        </Link> */}
      </Typography>
      {hidden ? null : (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', '& :not(:last-child)': { mr: 4 } }}>

        </Box>
      )}
    </Box>
  )
}

export default FooterContent
