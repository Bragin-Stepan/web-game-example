import { useCallback } from 'react';
import {
  ProgressionTree,
  useProgressionTreeViewport,
  type ProgressionPoint,
} from '@core-inc/progression-tree';
import { requestInterstitialAd } from '@core-inc/yandex-game-kit';
import { useTemplateStore } from '../game/GameStore';
import type { ProgressionNodeConfig } from '../content/schemas/ContentTypes';
import { Overlay } from './components/Overlay';

const GRID_SPACING = 132;
const NODE_SIZE = 104;

export function SkillTreeOverlay() {
  const isOpen = useTemplateStore((state) => state.ui.isSkillTreeOpen);
  const nodes = useTemplateStore((state) => state.content.progressionNodes);
  const gameState = useTemplateStore((state) => state.gameState);
  const buyNode = useTemplateStore((state) => state.buyNode);
  const toggleSkillTree = useTemplateStore((state) => state.toggleSkillTree);
  const viewport = useProgressionTreeViewport({
    minZoom: 0.65,
    maxZoom: 1.45,
  });

  const close = useCallback(() => {
    toggleSkillTree();
    requestInterstitialAd('template_skill_tree_close');
  }, [toggleSkillTree]);

  const owned = gameState.unlockedNodes;
  const canBuy = useCallback((node: ProgressionNodeConfig) => {
    return !owned[node.id]
      && gameState.resources.energy >= (node.cost.energy ?? 0)
      && node.parentIds.every((parentId) => owned[parentId]);
  }, [gameState.resources.energy, owned]);

  if (!isOpen) return null;

  const getPosition = (_nodeId: string, node?: ProgressionNodeConfig): ProgressionPoint => (
    node?.position ?? { x: 0, y: 0 }
  );

  return (
    <Overlay
      title="Progression"
      subtitle={`${Math.floor(gameState.resources.energy)} energy available`}
      onClose={close}
    >
        <ProgressionTree
          nodes={nodes}
          viewport={viewport}
          gridSpacing={GRID_SPACING}
          nodeSize={NODE_SIZE}
          getPosition={getPosition}
          getParentIds={(node) => node.parentIds}
          isNodeVisible={() => true}
          isConnectionActive={(node) => owned[node.id]}
          classNames={{
            surface: 'tree-surface',
            transform: 'tree-transform',
          }}
          renderNode={({ node, x, y, hasDragged }) => {
            const isOwned = owned[node.id];
            const isAvailable = canBuy(node);
            const isBlocked = !isOwned && !isAvailable;

            return (
              <button
                key={node.id}
                type="button"
                className={`tree-node ui-shine ${isOwned ? 'is-owned' : ''} ${isAvailable ? 'can-buy' : ''} ${isBlocked ? 'is-locked' : ''}`}
                style={{
                  width: NODE_SIZE,
                  height: NODE_SIZE,
                  transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                }}
                onPointerDown={(event) => {
                  event.stopPropagation();
                  viewport.hasDragged.current = false;
                }}
                onPointerMove={(event) => {
                  event.stopPropagation();
                }}
                onPointerUp={(event) => {
                  event.stopPropagation();
                }}
                onClick={() => {
                  if (hasDragged.current) return;
                  buyNode(node.id);
                }}
              >
                <strong>{node.title}</strong>
                <span>{node.description}</span>
                <small>
                  {isOwned
                    ? `+${node.rewards.productionPerSecond ?? 0}/sec`
                    : isBlocked
                      ? `Locked: ${node.cost.energy ?? 0} energy`
                      : `${node.cost.energy ?? 0} energy`}
                </small>
              </button>
            );
          }}
        />
    </Overlay>
  );
}
