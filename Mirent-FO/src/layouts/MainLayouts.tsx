import React, { useState, useEffect, useMemo } from "react";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import Sidebar from "../admin/Components/sidebar/sidebar";

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery("(max-width: 900px)");
  const isExtraSmallScreen = useMediaQuery("(max-width: 600px)");
  const [isCollapsed, setIsCollapsed] = useState(isSmallScreen);

  useEffect(() => {
    setIsCollapsed(isSmallScreen);
  }, [isSmallScreen]);

  const headerHeight = isExtraSmallScreen ? theme.layout.headerHeightXs : theme.layout.headerHeight; // px
  const { expandedWidth, collapsedWidth } = useMemo(() => {
    return {
      expandedWidth: isExtraSmallScreen ? theme.layout.sidebar.expandedWidthXs : theme.layout.sidebar.expandedWidth,
      collapsedWidth: isExtraSmallScreen ? theme.layout.sidebar.collapsedWidthXs : theme.layout.sidebar.collapsedWidth,
    };
  }, [isExtraSmallScreen, theme.layout.sidebar.collapsedWidth, theme.layout.sidebar.collapsedWidthXs, theme.layout.sidebar.expandedWidth, theme.layout.sidebar.expandedWidthXs]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Box display="flex" flexGrow={1} sx={{ pt: `${headerHeight}px` }}>
        <Box sx={{ width: isCollapsed ? `${collapsedWidth}px` : `${expandedWidth}px`, flexShrink: 0 }}>
          <Sidebar
            onCollapseChange={setIsCollapsed}
            headerHeight={headerHeight}
            expandedWidth={expandedWidth}
            collapsedWidth={collapsedWidth}
          />
        </Box>
        <Box flexGrow={1} p={3}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout;
