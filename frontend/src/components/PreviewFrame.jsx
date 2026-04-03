import { useEffect, useRef, useState } from "react";

/**
 * PreviewFrame — Renders AI-generated React + Tailwind code in a sandboxed iframe.
 * Uses React 18, Babel standalone, Tailwind CDN, and Recharts.
 */
export default function PreviewFrame({ code, refreshKey = 0 }) {
  const iframeRef = useRef(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!code || !iframeRef.current) return;
    setError(null);

    const htmlContent = buildHtml(code);
    const iframe = iframeRef.current;

    // Use srcdoc for sandboxing
    iframe.srcdoc = htmlContent;
  }, [code, refreshKey]);

  if (!code) {
    return (
      <div className="h-full flex items-center justify-center"
        style={{ background: "#0d1117", color: "rgba(100,120,150,0.5)", fontFamily: "'DM Sans', sans-serif", fontSize: 13 }}>
        Waiting for generated code...
      </div>
    );
  }

  return (
    <div className="h-full w-full relative" style={{ background: "#fff" }}>
      <iframe
        ref={iframeRef}
        title="App Preview"
        data-testid="preview-iframe"
        sandbox="allow-scripts allow-same-origin"
        style={{
          width: "100%",
          height: "100%",
          border: "none",
          background: "#fff",
        }}
      />
      {error && (
        <div style={{
          position: "absolute",
          bottom: 12,
          left: 12,
          right: 12,
          padding: "10px 14px",
          borderRadius: 10,
          background: "rgba(220,38,38,0.1)",
          border: "1px solid rgba(220,38,38,0.3)",
          color: "#fca5a5",
          fontSize: 12,
          fontFamily: "'JetBrains Mono', monospace",
          maxHeight: 100,
          overflow: "auto",
        }}>
          {error}
        </div>
      )}
    </div>
  );
}

function buildHtml(code) {
  // Escape the code for embedding in a script tag
  const escapedCode = code
    .replace(/\\/g, '\\\\')
    .replace(/`/g, '\\`')
    .replace(/\$/g, '\\$');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Preview</title>
  <script src="https://cdn.tailwindcss.com"><\/script>
  <script src="https://unpkg.com/react@18/umd/react.development.js" crossorigin><\/script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js" crossorigin><\/script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"><\/script>
  <script src="https://unpkg.com/recharts@2.12.7/umd/Recharts.js"><\/script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: system-ui, -apple-system, sans-serif; }
    #root { min-height: 100vh; }
  </style>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel" data-type="module">
    // Make recharts available
    const {
      BarChart, Bar, LineChart, Line, AreaChart, Area,
      PieChart, Pie, Cell, RadarChart, Radar, PolarGrid,
      PolarAngleAxis, PolarRadiusAxis,
      XAxis, YAxis, CartesianGrid, Tooltip, Legend,
      ResponsiveContainer, ComposedChart, Scatter, ScatterChart
    } = window.Recharts || {};
    
    // Provide common React hooks
    const { useState, useEffect, useCallback, useMemo, useRef, useContext, createContext, memo, Fragment } = React;
    
    try {
      // The generated component code
      ${escapedCode}
      
      // Find the default export
      const Component = typeof App !== 'undefined' ? App 
        : typeof TodoApp !== 'undefined' ? TodoApp
        : typeof Dashboard !== 'undefined' ? Dashboard  
        : typeof Store !== 'undefined' ? Store
        : typeof MainApp !== 'undefined' ? MainApp
        : (() => React.createElement('div', {style: {padding: 40, color: '#666'}}, 'No default export found'));

      const root = ReactDOM.createRoot(document.getElementById('root'));
      root.render(React.createElement(Component));
    } catch (err) {
      document.getElementById('root').innerHTML = 
        '<div style="padding: 20px; color: #ef4444; font-family: monospace; font-size: 13px; background: #1a1a1a; min-height: 100vh;">' +
        '<h3 style="margin-bottom: 8px;">Preview Error</h3>' +
        '<pre style="white-space: pre-wrap; word-break: break-word;">' + err.message + '</pre></div>';
    }
  <\/script>
</body>
</html>`;
}
