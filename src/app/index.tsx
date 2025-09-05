import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomePage from 'src/pages/home';
import AboutPage from 'src/pages/about';
import Header from 'src/widgets/header';

const App: React.FC = () => {
  return (
    <ChakraProvider>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  );
};

export default App;
