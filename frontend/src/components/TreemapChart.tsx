import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

interface SpendNode {
  name: string;
  value?: number;
  children?: SpendNode[];
  color?: string;
}

interface TreemapChartProps {
  width?: number;
  height?: number;
  onCategoryClick?: (category: string, subcategory?: string) => void;
}

// Indirect Spend Data with subcategories (in Crores)
const indirectSpendData: SpendNode = {
  name: "Indirect Spend",
  children: [
    {
      name: "Logistics & Supply Chain",
      color: "#2874f0",
      children: [
        { name: "Freight & Transportation", value: 185 },
        { name: "Warehousing", value: 145 },
        { name: "Last Mile Delivery", value: 95 },
        { name: "Cold Chain", value: 60 }
      ]
    },
    {
      name: "Technology",
      color: "#6366f1",
      children: [
        { name: "SaaS & Cloud", value: 120 },
        { name: "IT Infrastructure", value: 85 },
        { name: "Software Licenses", value: 45 },
        { name: "Cybersecurity", value: 30 }
      ]
    },
    {
      name: "Services",
      color: "#22c55e",
      children: [
        { name: "Professional Services", value: 95 },
        { name: "Legal & Compliance", value: 65 },
        { name: "Consulting", value: 55 },
        { name: "Training", value: 30 }
      ]
    },
    {
      name: "Marketing",
      color: "#f59e0b",
      children: [
        { name: "Digital Advertising", value: 85 },
        { name: "Brand & Creative", value: 55 },
        { name: "Events & Sponsorships", value: 35 },
        { name: "Market Research", value: 20 }
      ]
    },
    {
      name: "Facilities",
      color: "#8b5cf6",
      children: [
        { name: "Real Estate & Rent", value: 75 },
        { name: "Maintenance", value: 45 },
        { name: "Utilities", value: 30 },
        { name: "Security", value: 18 }
      ]
    },
    {
      name: "Outsourcing",
      color: "#ec4899",
      children: [
        { name: "Recruitment & HR", value: 55 },
        { name: "Customer Support", value: 42 },
        { name: "BPO Services", value: 30 }
      ]
    }
  ]
};

const TreemapChart: React.FC<TreemapChartProps> = ({
  width = 600,
  height = 400,
  onCategoryClick
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    x: number;
    y: number;
    name: string;
    value: number;
    parent: string;
  }>({ visible: false, x: 0, y: 0, name: '', value: 0, parent: '' });
  const [dimensions, setDimensions] = useState({ width, height });

  // Responsive sizing
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        setDimensions({
          width: containerWidth,
          height: Math.max(350, containerWidth * 0.6)
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const { width: w, height: h } = dimensions;
    const margin = { top: 10, right: 10, bottom: 10, left: 10 };
    const innerWidth = w - margin.left - margin.right;
    const innerHeight = h - margin.top - margin.bottom;

    // Create hierarchy
    const root = d3.hierarchy(indirectSpendData)
      .sum(d => d.value || 0)
      .sort((a, b) => (b.value || 0) - (a.value || 0));

    // Create treemap layout
    d3.treemap<SpendNode>()
      .size([innerWidth, innerHeight])
      .paddingOuter(3)
      .paddingTop(19)
      .paddingInner(2)
      .round(true)(root);

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Color scale for categories
    const colorMap: Record<string, string> = {};
    indirectSpendData.children?.forEach(cat => {
      colorMap[cat.name] = cat.color || '#999';
    });

    // Draw cells
    const cell = g.selectAll("g")
      .data(root.leaves())
      .join("g")
      .attr("transform", d => `translate(${(d as any).x0},${(d as any).y0})`);

    // Cell rectangles
    cell.append("rect")
      .attr("width", d => Math.max(0, (d as any).x1 - (d as any).x0))
      .attr("height", d => Math.max(0, (d as any).y1 - (d as any).y0))
      .attr("fill", d => {
        const parent = d.parent?.data.name || '';
        const baseColor = colorMap[parent] || '#6b7280';
        return baseColor;
      })
      .attr("fill-opacity", 0.85)
      .attr("rx", 3)
      .attr("ry", 3)
      .style("cursor", "pointer")
      .on("mouseenter", function(event, d) {
        d3.select(this)
          .attr("fill-opacity", 1)
          .attr("stroke", "#fff")
          .attr("stroke-width", 2);

        const rect = (event.target as SVGRectElement).getBoundingClientRect();
        const containerRect = containerRef.current?.getBoundingClientRect();
        if (containerRect) {
          setTooltip({
            visible: true,
            x: rect.left - containerRect.left + rect.width / 2,
            y: rect.top - containerRect.top - 10,
            name: d.data.name,
            value: d.value || 0,
            parent: d.parent?.data.name || ''
          });
        }
      })
      .on("mouseleave", function() {
        d3.select(this)
          .attr("fill-opacity", 0.85)
          .attr("stroke", "none");
        setTooltip(prev => ({ ...prev, visible: false }));
      })
      .on("click", (_, d) => {
        if (onCategoryClick) {
          onCategoryClick(d.parent?.data.name || '', d.data.name);
        }
      });

    // Cell labels
    cell.append("text")
      .attr("x", 4)
      .attr("y", 14)
      .attr("fill", "#fff")
      .attr("font-size", d => {
        const cellWidth = (d as any).x1 - (d as any).x0;
        const cellHeight = (d as any).y1 - (d as any).y0;
        if (cellWidth > 100 && cellHeight > 40) return "11px";
        if (cellWidth > 60 && cellHeight > 30) return "9px";
        return "8px";
      })
      .attr("font-weight", 500)
      .text(d => {
        const cellWidth = (d as any).x1 - (d as any).x0;
        const cellHeight = (d as any).y1 - (d as any).y0;
        if (cellWidth < 50 || cellHeight < 25) return '';
        const name = d.data.name;
        const maxChars = Math.floor(cellWidth / 7);
        return name.length > maxChars ? name.substring(0, maxChars - 2) + '..' : name;
      });

    // Cell values
    cell.append("text")
      .attr("x", 4)
      .attr("y", 28)
      .attr("fill", "#fff")
      .attr("fill-opacity", 0.9)
      .attr("font-size", "10px")
      .text(d => {
        const cellWidth = (d as any).x1 - (d as any).x0;
        const cellHeight = (d as any).y1 - (d as any).y0;
        if (cellWidth < 50 || cellHeight < 35) return '';
        return `₹${d.value} Cr`;
      });

    // Draw category labels (parent nodes)
    const categories = root.children || [];
    categories.forEach(category => {
      const cat = category as any;
      g.append("rect")
        .attr("x", cat.x0)
        .attr("y", cat.y0)
        .attr("width", cat.x1 - cat.x0)
        .attr("height", 18)
        .attr("fill", colorMap[category.data.name] || '#6b7280')
        .attr("rx", 3)
        .attr("ry", 3);

      g.append("text")
        .attr("x", cat.x0 + 6)
        .attr("y", cat.y0 + 13)
        .attr("fill", "#fff")
        .attr("font-size", "11px")
        .attr("font-weight", 600)
        .text(() => {
          const name = category.data.name;
          const maxWidth = cat.x1 - cat.x0 - 60;
          const maxChars = Math.floor(maxWidth / 6);
          return name.length > maxChars ? name.substring(0, maxChars - 2) + '..' : name;
        });

      // Category total
      g.append("text")
        .attr("x", cat.x1 - 6)
        .attr("y", cat.y0 + 13)
        .attr("fill", "#fff")
        .attr("fill-opacity", 0.9)
        .attr("font-size", "10px")
        .attr("text-anchor", "end")
        .text(`₹${category.value} Cr`);
    });

  }, [dimensions, onCategoryClick]);

  return (
    <div ref={containerRef} className="relative w-full">
      <svg
        ref={svgRef}
        width={dimensions.width}
        height={dimensions.height}
        className="overflow-visible"
      />

      {/* Tooltip */}
      {tooltip.visible && (
        <div
          className="absolute pointer-events-none bg-gray-900 text-white px-3 py-2 rounded-lg shadow-lg text-sm z-50 transform -translate-x-1/2 -translate-y-full"
          style={{ left: tooltip.x, top: tooltip.y }}
        >
          <div className="font-semibold">{tooltip.name}</div>
          <div className="text-gray-300 text-xs">{tooltip.parent}</div>
          <div className="text-emerald-400 font-medium mt-1">₹{tooltip.value} Cr</div>
          <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-full">
            <div className="border-8 border-transparent border-t-gray-900"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TreemapChart;
