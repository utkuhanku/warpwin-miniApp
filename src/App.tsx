// App.tsx
import React, { useState } from "react";
import { ethers } from "ethers";
import Minesweeper from "./Minesweeper";

const CONTRACT_ADDRESS = "0xF074bDfF6F88f261E3AE4E975c4E343aD01226C6";
const CONTRACT_ABI = [
  "function playGame() external payable",
  "function claimReward(bool won) external",
  "function getPotBalance() external view returns (uint256)"
];

declare global {
  interface Window {
    ethereum?: any;
  }
}

function App() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [isWinner, setIsWinner] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const connectWallet = async () => {
    if (typeof window.ethereum === "undefined") return;
    const newProvider = new ethers.BrowserProvider(window.ethereum);
    await newProvider.send("eth_requestAccounts", []);
    const newSigner = await newProvider.getSigner();
    const newContract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, newSigner);
    setProvider(newProvider);
    setSigner(newSigner);
    setContract(newContract);
    setWalletConnected(true);
    console.log("Wallet connected:", await newSigner.getAddress());
  };

  const startGame = async () => {
    if (!contract) return;
    try {
      setIsLoading(true);
      const stakeAmount = ethers.parseUnits("0.001", "ether");
      const tx = await contract.playGame({ value: stakeAmount });
      await tx.wait();
      setGameStarted(true);
    } catch (error: any) {
      console.error("Stake error:", error);
      alert("İşleminiz başarısız oldu: " + (error.reason || error.message));
    } finally {
      setIsLoading(false);
    }
  };

  const restartGame = async () => {
    setGameStarted(false);
    await startGame();
  };

  const finishGame = async (won: boolean) => {
    if (!contract) return;
    try {
      const tx = await contract.claimReward(won);
      await tx.wait();
      if (won) {
        alert("🎉 Kazandın! Ödülünüz cüzdanınıza gönderildi!");
        setIsWinner(true);
      } else {
        alert("💥 Kaybettin. Stake işlemi tamamlandı.");
      }
    } catch (error: any) {
      console.error("Claim error:", error);
      alert("İşlem başarısız oldu: " + (error.reason || error.message));
    }
  };

  if (!walletConnected) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", color: "white" }}>
        <button onClick={connectWallet} style={{ color: "black", fontWeight: "bold" }}>Connect Wallet</button>
      </div>
    );
  }

  if (gameStarted) {
    return <Minesweeper onGameEnd={finishGame} onBack={() => setGameStarted(false)} onRestart={restartGame} />;
  }

  return (
    <div style={{ textAlign: "center", marginTop: "100px", color: "white" }}>
      <h3>WarpWin - Retro Windows Game</h3>
      <p>Welcome to WarpWin!</p>
      <p>Choose a game to play:</p>
      <button onClick={startGame} style={{ color: "black", fontWeight: "bold", marginBottom: "10px" }}>
        Start Game (Stake 0.001 ETH)
      </button>
      {isLoading && (
        <div style={{ marginTop: "10px", color: "orange" }}>⏳ Ödeme bekleniyor...</div>
      )}
      <div style={{ marginTop: "20px", fontSize: "14px", color: "#FFD700" }}>
        ⭐ 100x şans! En riskli ama en büyük ödüllü Minesweeper turu!
      </div>
    </div>
  );
}

export default App;
