import { NodeViewProps, NodeViewWrapper, NodeViewContent } from "@tiptap/react";
import { cn } from "@bytesend/ui/lib/utils";

export function UnsubscribeFooterComponent(props: NodeViewProps) {
  return (
    <NodeViewWrapper
      className={`react-component footer`}
      draggable="true"
      data-drag-handle=""
    >
      <NodeViewContent className="content" />
    </NodeViewWrapper>
  );
}
