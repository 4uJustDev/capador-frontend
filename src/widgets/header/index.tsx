import { Grid, Box, Button, Text } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { LuShoppingCart, LuInfo } from 'react-icons/lu';

const Header: React.FC = () => {
  return (
    <Grid
      as="header"
      templateColumns="1fr auto 1fr"
      alignItems="center"
      py={4}
      px={4}
      borderBottomWidth="1px"
    >
      <Box />

      <Text fontSize="2xl">
        <Link to="/">CAPADOR</Link>
      </Text>

      <Box justifySelf="end" display="flex" gap="2">
        <Button asChild as={Link} colorPalette="teal" variant="outline">
          <a href="/shop">
            <LuShoppingCart /> Shop
          </a>
        </Button>
        <Button asChild as={Link} colorPalette="teal" variant="outline">
          <a href="/about">
            <LuInfo /> About
          </a>
        </Button>
      </Box>
    </Grid>
  );
};
export default Header;
