import { useEffect, useState } from 'react';
import { Box, Spinner, Image, SimpleGrid, Text } from '@chakra-ui/react';
import { http } from 'src/shared/api/http';
import { toErrorMessage } from 'src/shared/api/error';
import { mediaUrl } from 'src/shared/api/media';
// import type { ICategory } from 'src/entities';

type ProductPhoto = {
  thumbpath: string;
  filepath: string;
  is_main: boolean;
  id: number;
  product_id: number;
};
type Product = {
  id: number;
  name: string;
  price: string;
  photos?: ProductPhoto[];
};

const HomePage: React.FC = () => {
  const [categories, setCategories] = useState<any[] | null>(null);
  const [products, setProducts] = useState<Product[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const [catsRes, prodRes] = await Promise.all([
          http.get('/categories/tree'),
          http.get<Product[]>('/products'),
        ]);
        if (!alive) return;
        setCategories(catsRes.data);
        setProducts(prodRes.data);
      } catch (e) {
        if (alive) console.error(toErrorMessage(e));
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
      <Text mb={3} fontWeight="bold">
        START PAGE
      </Text>

      {/* Сетка товаров с картинками */}
      <SimpleGrid columns={{ base: 2, md: 3, lg: 4 }} gap={4} mb={8}>
        {products?.map((p) => {
          const thumb = p.photos?.[0]?.filepath; // бери is_main если нужно
          return (
            <Box key={p.id} borderWidth="1px" borderRadius="md" p={2}>
              <Image
                src={mediaUrl(thumb)} // <-- абсолютный URL
                alt={p.name}
                objectFit="cover"
                w="100%"
                aspectRatio={1} // квадратная карточка
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

      {/* Если все еще нужно увидеть сырые данные: */}
      {/* <Code display="block" whiteSpace="pre" mt={4}>{JSON.stringify(categories, null, 2)}</Code> */}
      {/* <Code display="block" whiteSpace="pre" mt={4}>{JSON.stringify(products, null, 2)}</Code> */}
    </Box>
  );
};

export default HomePage;
