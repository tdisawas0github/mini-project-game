import { motion } from 'framer-motion';
import React from 'react';
import { useGameState } from '../hooks/useGameState';
import { valdarenRegions, valdarenFactionsLegacy } from '../utils/worldDataParser';
import { HubContainer, HubTitle, ChoiceButton } from '../styles/visualNovel';
import styled from 'styled-components';

const Container = styled.div`
  padding: 20px;
`;

const Legend = styled.div`
  margin-bottom: 12px;
`;

const Row = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  margin-bottom: 6px;
`;

const Color = styled.div<{ c: string }>`
  width: 12px;
  height: 12px;
  background: ${p => p.c};
  border-radius: 2px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 12px;
`;

const Card = styled.div`
  background: rgba(10,10,30,0.9);
  padding: 12px;
  border-radius: 8px;
`;

export default function WorldMap({ onReturn }: { onReturn: () => void }) {
  const { gameState } = useGameState();

  return (
    <Container>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <HubTitle>Map of Valdaren</HubTitle>
      </motion.div>

      <Legend>
        <div style={{ fontWeight: 700, color: '#d4af37' }}>Factions</div>
        <Row><Color c="#3b82f6"/> Institute</Row>
        <Row><Color c="#22c55e"/> Clans</Row>
        <Row><Color c="#a855f7"/> Echoborn</Row>
      </Legend>

      <Grid>
        {valdarenRegions.map(r => (
          <Card key={r.id}>
            <div style={{ fontWeight: 700, color: '#d4af37' }}>{r.name}</div>
            <div style={{ fontSize: '0.9rem', color: '#9ca3af' }}>{valdarenFactionsLegacy[r.faction as keyof typeof valdarenFactionsLegacy]?.name || r.faction}</div>
            <div style={{ marginTop: 8, color: '#d1d5db' }}>{r.description}</div>
            <div style={{ marginTop: 8, color: '#9ca3af' }}>Influence: {r.influence}%</div>
            {gameState?.knownLanguages?.length > 0 && (
              <div style={{ marginTop: 8, color: '#9ca3af' }}>Your Standing: {gameState.factionInfluence?.[r.faction as keyof typeof gameState.factionInfluence] ?? '—'}</div>
            )}
          </Card>
        ))}
      </Grid>

      <div style={{ marginTop: 12 }}>
        <ChoiceButton onClick={onReturn}>← Return to Hub</ChoiceButton>
      </div>
    </Container>
  );
}
