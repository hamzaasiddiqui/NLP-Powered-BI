import PropTypes from 'prop-types';
import { Card, CardContent, Stack, Typography } from '@mui/material';

export const OverviewCard = (props) => {
  const { sx, title, value, symbol } = props;

  return (
    <Card sx={sx}>
      <CardContent>
        <Stack
          alignItems="flex-start"
          direction="row"
          justifyContent="space-between"
          spacing={3}
        >
          <Stack spacing={1}>
            <Typography
              color="text.secondary"
              variant="overline"
            >
              {title}
            </Typography>
            <Typography variant="h4">
              {value}
              {symbol}
            </Typography>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

OverviewCard.propTypes = {
    title: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  sx: PropTypes.object
};