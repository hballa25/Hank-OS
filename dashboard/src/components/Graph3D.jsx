import React, { useMemo, useRef, useCallback, useEffect, useState } from 'react'
import ForceGraph3D from 'react-force-graph-3d'
import { DOMAIN_COLORS, HIGHLIGHT } from '../constants.js'

export default function Graph3D({ graph, activeDomains, highlightIds, onNodeClick, flyToId }) {
  const fgRef = useRef()
  const didFit = useRef(false)
  const containerRef = useRef()
  const [size, setSize] = useState({ w: window.innerWidth, h: window.innerHeight })

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const ro = new ResizeObserver(() =>
      setSize({ w: el.clientWidth, h: el.clientHeight })
    )
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    // dev/debug handle (also used by future voice + automation layers)
    window.__hankGraph = fgRef.current
    window.__hankData = data
  })

  const data = useMemo(() => {
    const nodes = graph.nodes
      .filter((n) => activeDomains.has(n.domain))
      .map((n) => ({ ...n, val: 1 + Math.min(n.degree, 20) }))
    const ids = new Set(nodes.map((n) => n.id))
    const links = graph.links
      .filter((l) => ids.has(typeof l.source === 'object' ? l.source.id : l.source) && ids.has(typeof l.target === 'object' ? l.target.id : l.target))
      .map((l) => ({ source: typeof l.source === 'object' ? l.source.id : l.source, target: typeof l.target === 'object' ? l.target.id : l.target }))
    return { nodes, links }
  }, [graph, activeDomains])

  const nodeColor = useCallback(
    (n) => (highlightIds.has(n.id) ? HIGHLIGHT : DOMAIN_COLORS[n.domain] || '#888'),
    [highlightIds]
  )

  useEffect(() => {
    if (!flyToId || !fgRef.current) return
    const node = data.nodes.find((n) => n.id === flyToId)
    if (!node || node.x === undefined) return
    const dist = 120
    const ratio = 1 + dist / Math.hypot(node.x, node.y, node.z || 1)
    fgRef.current.cameraPosition(
      { x: node.x * ratio, y: node.y * ratio, z: node.z * ratio },
      node,
      1200
    )
  }, [flyToId, data.nodes])

  return (
    <div ref={containerRef} style={{ position: 'absolute', inset: 0 }}>
    <ForceGraph3D
      ref={fgRef}
      width={size.w}
      height={size.h}
      graphData={data}
      backgroundColor="#050510"
      nodeLabel={(n) => `${n.name}${n.type ? ` · ${n.type}` : ''}`}
      nodeColor={nodeColor}
      nodeOpacity={0.92}
      nodeResolution={12}
      linkColor={() => 'rgba(140,150,190,0.45)'}
      linkWidth={0.6}
      linkOpacity={0.5}
      onNodeClick={(n) => onNodeClick(n)}
      onEngineStop={() => {
        if (!didFit.current && fgRef.current) {
          didFit.current = true
          fgRef.current.zoomToFit(800, 60)
        }
      }}
      warmupTicks={60}
      cooldownTime={4000}
    />
    </div>
  )
}
