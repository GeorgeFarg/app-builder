import { JSX } from "react"
import { TagType } from "@/types/page"

const RenderTag = ({node}: {node: TagType}) => {
    const Tag = node.tagName as keyof JSX.IntrinsicElements
  return (
    <Tag id={node.id} {...node.props} style={node.style}>
      {node.textContent}
      {
      node.children?.map(childNode => <RenderTag key={childNode.id} node={childNode}/>) 
      }
    </Tag>
  )
}

export default RenderTag