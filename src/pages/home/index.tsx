import { useEffect, useState } from 'react';
import { Box, Spinner, Alert, AlertIcon, Code } from '@chakra-ui/react';
import { http } from 'src/shared/api/http';
import { toErrorMessage } from 'src/shared/api/error';
import type { ICategory } from 'src/entities';

const HomePage: React.FC = () => {
  const [data, setData] = useState<ICategory[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await http.get<ICategory[]>('/categories/tree');
        if (alive) setData(res.data);
      } catch (e) {
        if (alive) setErr(toErrorMessage(e));
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

  if (err) {
    return (
      <Alert status="error" p={4}>
        <AlertIcon />
        {err}
      </Alert>
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
