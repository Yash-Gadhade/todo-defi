import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { configureChains, createClient, WagmiConfig } from 'wagmi';
import { goerli } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import '@rainbow-me/rainbowkit/styles.css';

import Header from './components/Header';
import Home from './pages/Home';
import JoinCampaign from './pages/JoinCampaign';

const { chains, provider } = configureChains([goerli], [publicProvider()]);

const { connectors } = getDefaultWallets({
  appName: 'My RainbowKit App',
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

const App: React.FC<{}> = () => {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <Router>
          <main>
            <Header />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/join" element={<JoinCampaign />} />
            </Routes>
          </main>
        </Router>
      </RainbowKitProvider>
    </WagmiConfig>
  );
};

export default App;
