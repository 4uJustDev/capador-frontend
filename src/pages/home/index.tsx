import { useEffect, useState } from 'react';
import { Box, Spinner, Code } from '@chakra-ui/react';
import { http } from 'src/shared/api/http';
import { toErrorMessage } from 'src/shared/api/error';
import type { ICategory } from 'src/entities';

const HomePage: React.FC = () => {
  const [data, setData] = useState<ICategory[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await http.get<ICategory[]>('/categories/tree');
        if (alive) setData(res.data);
      } catch (e) {
        if (alive) console.error(toErrorMessage(e));
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false; // защищаемся от setState после unmount
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
      <div>START PAGE</div>
      <Code display="block" whiteSpace="pre" mt={4}>
        {JSON.stringify(data, null, 2)}
      </Code>
    </Box>
  );
};

export default HomePage;
