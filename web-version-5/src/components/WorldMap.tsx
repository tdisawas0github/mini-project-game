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
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 18px;
  flex-wrap: wrap;
`;

const LegendTitle = styled.div`
  font-weight: 700;
  color: #d4af37;
`;

const Row = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const Color = styled.div<{ c: string }>`
  width: 14px;
  height: 14px;
  background: ${p => p.c};
  border-radius: 3px;
  border: 1px solid rgba(255,255,255,0.08);
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
`;

const Card = styled.div`
  background: linear-gradient(180deg, rgba(12,12,40,0.9), rgba(6,6,24,0.85));
  padding: 14px;
  border-radius: 10px;
  border: 1px solid rgba(255,255,255,0.04);
  transition: transform 180ms ease, box-shadow 180ms ease;
  will-change: transform;

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 10px 30px rgba(2,6,23,0.6);
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Title = styled.div`
  font-weight: 700;
  color: #d4af37;
  font-size: 1rem;
`;

const Badge = styled.div<{ c?: string }>`
  padding: 6px 8px;
  background: rgba(255,255,255,0.03);
  border-radius: 999px;
  font-size: 0.8rem;
  color: ${p => p.c || '#9ca3af'};
  border: 1px solid rgba(255,255,255,0.04);
`;

const Desc = styled.div`
  margin-top: 8px;
  color: #cbd5e1;
  font-size: 0.92rem;
  line-height: 1.35;
`;

const InfluenceWrap = styled.div`
  margin-top: 12px;
`;

const InfluenceBg = styled.div`
  width: 100%;
  height: 10px;
  border-radius: 999px;
  background: rgba(255,255,255,0.04);
  overflow: hidden;
`;

const InfluenceFill = styled.div<{ pct: number; c: string }>`
  height: 100%;
  width: ${p => Math.max(0, Math.min(100, p.pct))}%;
  background: ${p => p.c};
  transition: width 420ms ease;
`;

export default function WorldMap({ onReturn }: { onReturn: () => void }) {
  const { gameState } = useGameState();

  return (
    <Container>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <HubTitle>Map of Valdaren</HubTitle>
      </motion.div>

      <Legend>
        <LegendTitle>Factions</LegendTitle>
        <Row><Color c="#3b82f6"/> Institute</Row>
        <Row><Color c="#22c55e"/> Clans</Row>
        <Row><Color c="#a855f7"/> Echoborn</Row>
      </Legend>

      <Grid>
        {valdarenRegions.map(r => (
          <Card key={r.id}>
            <CardHeader>
              <Title>{r.name}</Title>
              <Badge c={
                r.faction === 'institute' ? '#3b82f6' :
                r.faction === 'clans' ? '#22c55e' :
                r.faction === 'echoborn' ? '#a855f7' : '#9ca3af'
              }>{valdarenFactionsLegacy[r.faction as keyof typeof valdarenFactionsLegacy]?.name || r.faction}</Badge>
            </CardHeader>

            <Desc>{r.description}</Desc>

            <InfluenceWrap>
              <div style={{ fontSize: '0.9rem', color: '#9ca3af', marginBottom: 6 }}>Influence: {r.influence}%</div>
              <InfluenceBg>
                <InfluenceFill pct={r.influence} c={
                  r.faction === 'institute' ? '#3b82f6' :
                  r.faction === 'clans' ? '#22c55e' :
                  r.faction === 'echoborn' ? '#a855f7' : '#9ca3af'
                } />
              </InfluenceBg>
            </InfluenceWrap>

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
