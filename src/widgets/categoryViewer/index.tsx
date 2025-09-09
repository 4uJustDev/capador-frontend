import { TreeView, createTreeCollection, Box, Spinner, Alert } from '@chakra-ui/react';
import { LuFile, LuFolder } from 'react-icons/lu';
import type { ICategory } from 'src/entities';

import { useEffect, useState } from 'react';
import { _Async } from 'src/shared/api/AsyncClient';

const CategoryViewer: React.FC = () => {
  const [categories, setCategories] = useState<ICategory[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await _Async.get<ICategory[]>('/categories/tree');
        setCategories(data);
      } catch (e: any) {
        if (e?.code !== 'ERR_CANCELED') setError(e.message ?? 'Failed to load categories');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <Box p={4}>
        <Spinner />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert.Root status="error">
        <Alert.Indicator />
        <Alert.Title>{error}</Alert.Title>
      </Alert.Root>
    );
  }

  const collection = createTreeCollection<ICategory>({
    nodeToValue: (node) => node.id.toString(),
    nodeToString: (node) => node.name,

    rootNode: categories[0],
  });

  return (
    <TreeView.Root collection={collection} maxW="sm">
      <TreeView.Label>Categories</TreeView.Label>
      <TreeView.Tree>
        <TreeView.Node
          indentGuide={<TreeView.BranchIndentGuide />}
          render={({ node, nodeState }) =>
            nodeState.isBranch ? (
              <TreeView.BranchControl>
                <LuFolder />
                <TreeView.BranchText>{node.name}</TreeView.BranchText>
              </TreeView.BranchControl>
            ) : (
              <TreeView.Item>
                <LuFile />
                <TreeView.ItemText>{node.name}</TreeView.ItemText>
              </TreeView.Item>
            )
          }
        />
      </TreeView.Tree>
    </TreeView.Root>
  );
};
export default CategoryViewer;
