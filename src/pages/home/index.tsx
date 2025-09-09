import { useEffect, useState } from 'react';
import { Box, Spinner, Image, SimpleGrid, Text } from '@chakra-ui/react';
import { _Async, mediaUrl } from 'src/shared/api/AsyncClient';
import type { IProduct } from 'src/entities';

const HomePage: React.FC = () => {
  const [products, setProducts] = useState<IProduct[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const products = await _Async.get<IProduct[]>('/products/category/1');
        if (!alive) return;

        setProducts(products);
      } catch (e) {
        if (alive) console.error(e);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  if (loading) {
    return (
      <Box p={4}>
        <Spinner />
      </Box>
    );
  }

  return (
    <Box p={4}>
      <SimpleGrid columns={{ base: 2, md: 3, lg: 4 }} gap={4} mb={8}>
        {products?.map((p) => {
          const thumb = p.photos?.[0]?.filepath;
          return (
            <Box key={p.id} borderWidth="1px" borderRadius="md" p={2}>
              <Image
                src={mediaUrl(thumb)}
                alt={p.name}
                objectFit="cover"
                w="100%"
                aspectRatio={1}
              />
              <Text mt={2} fontWeight="semibold">
                {p.name}
              </Text>
              <Text fontSize="sm" opacity={0.8}>
                {p.price} ₽
              </Text>
            </Box>
          );
        })}
      </SimpleGrid>
    </Box>
  );
};

export default HomePage;
