import type {
  CSSProperties,
  Dispatch,
  MutableRefObject,
  PointerEvent,
  ReactNode,
  SetStateAction,
  TouchEvent,
  WheelEvent,
} from 'react';

export type ProgressionPoint = {
  x: number;
  y: number;
};

export type ProgressionTreeNodeLike = {
  id: string;
  position?: ProgressionPoint;
  parentIds?: string[];
  requires?: string[];
  isUnlocked?: boolean;
  canUnlock?: boolean;
  isVisible?: boolean;
};

export type ProgressionTreeViewportState = {
  pan: ProgressionPoint;
  setPan: Dispatch<SetStateAction<ProgressionPoint>>;
  zoom: number;
  setZoom: Dispatch<SetStateAction<number>>;
  isPanning: MutableRefObject<boolean>;
  hasDragged: MutableRefObject<boolean>;
  handlers: {
    onPointerDown: (event: PointerEvent<HTMLElement>) => void;
    onPointerMove: (event: PointerEvent<HTMLElement>) => void;
    onPointerUp: (event: PointerEvent<HTMLElement>) => void;
    onPointerCancel: (event: PointerEvent<HTMLElement>) => void;
    onWheel: (event: WheelEvent<HTMLElement>) => void;
    onTouchStart: (event: TouchEvent<HTMLElement>) => void;
    onTouchMove: (event: TouchEvent<HTMLElement>) => void;
    onTouchEnd: () => void;
  };
  reset: (pan?: ProgressionPoint, zoom?: number) => void;
};

export type ProgressionTreeClassNames = {
  surface?: string;
  transform?: string;
};

export type ProgressionTreeSurfaceRenderArgs = {
  pan: ProgressionPoint;
  zoom: number;
  isPanning: boolean;
  hasDragged: MutableRefObject<boolean>;
};

export type ProgressionTreeSurfaceProps = {
  viewport: ProgressionTreeViewportState;
  classNames?: ProgressionTreeClassNames;
  style?: CSSProperties;
  editorPanelSelector?: string;
  children: ReactNode | ((args: ProgressionTreeSurfaceRenderArgs) => ReactNode);
};

export type ProgressionPurchaseBurst = {
  id: string;
  x: number;
  y: number;
};

export type ProgressionTreeProps<TNode extends ProgressionTreeNodeLike> = {
  nodes: TNode[];
  viewport: ProgressionTreeViewportState;
  gridSpacing: number;
  nodeSize: number;
  getPosition?: (nodeId: string, node?: TNode) => ProgressionPoint;
  getParentIds?: (node: TNode) => string[];
  isNodeVisible?: (node: TNode) => boolean;
  isConnectionActive?: (node: TNode) => boolean;
  renderNode: (args: {
    node: TNode;
    position: ProgressionPoint;
    x: number;
    y: number;
    hasDragged: MutableRefObject<boolean>;
  }) => ReactNode;
  renderOverlay?: ReactNode;
  bursts?: ProgressionPurchaseBurst[];
  classNames?: ProgressionTreeClassNames;
  style?: CSSProperties;
};

export type ProgressionTreeEditorOptions<TNode extends ProgressionTreeNodeLike> = {
  nodes: TNode[];
  cloneNode?: (node: TNode) => TNode;
  getNodeId?: (node: TNode) => string;
  getNodePosition?: (node: TNode) => ProgressionPoint;
};

export type ProgressionTreeEditorState<TNode extends ProgressionTreeNodeLike> = {
  editedNodes: Record<string, TNode>;
  setEditedNodes: Dispatch<SetStateAction<Record<string, TNode>>>;
  selectedNodeId: string | null;
  setSelectedNodeId: Dispatch<SetStateAction<string | null>>;
  selectedNode: TNode | null;
  resetEditedNodes: () => void;
  getEditedNode: (nodeId: string) => TNode | undefined;
  updateEditedNode: (nodeId: string, updater: (node: TNode) => TNode) => void;
  getNodePosition: (nodeId: string) => ProgressionPoint;
  exportEditedNodes: () => TNode[];
  exportEditedNodesJson: () => string;
};

export type ProgressionTreeEditorPanelLabels = {
  title?: string;
  disabledHint?: string;
  emptySelection?: string;
  nodeLabel?: string;
  positionTitle?: string;
  dependenciesTitle?: string;
};

export type ProgressionTreeEditorPanelClassNames = {
  root?: string;
  section?: string;
  sectionTitle?: string;
  hint?: string;
  nodeId?: string;
  fieldGrid?: string;
  label?: string;
  input?: string;
  dependencyList?: string;
  dependencyLabel?: string;
};

export type ProgressionTreeEditorPanelProps<TNode extends ProgressionTreeNodeLike> = {
  nodes: TNode[];
  selectedNode: TNode | null;
  isActive: boolean;
  getParentIds?: (node: TNode) => string[];
  setParentIds?: (node: TNode, parentIds: string[]) => TNode;
  getPosition?: (node: TNode) => ProgressionPoint;
  setPosition?: (node: TNode, position: ProgressionPoint) => TNode;
  updateNode: (nodeId: string, updater: (node: TNode) => TNode) => void;
  snapPosition?: (value: number) => number;
  positionStep?: number;
  labels?: ProgressionTreeEditorPanelLabels;
  classNames?: ProgressionTreeEditorPanelClassNames;
  renderExtraFields?: (args: {
    selectedNode: TNode;
    updateNode: (updater: (node: TNode) => TNode) => void;
  }) => ReactNode;
};
