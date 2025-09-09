import { TreeView, createTreeCollection } from '@chakra-ui/react';
import { LuFile, LuFolder } from 'react-icons/lu';
import type { ICategory } from 'src/entities';

import { useEffect, useState } from 'react';
import { Box, Spinner } from '@chakra-ui/react';
import { toErrorMessage } from 'src/shared/api/error';
import { _Async } from 'src/shared/api/AsyncClient';

const CategoryViewer: React.FC = () => {
  const [categories, setCategories] = useState<ICategory[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const categories = await _Async.get<ICategory[]>('/categories/tree');
        if (!alive) return;

        setCategories(categories);
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
