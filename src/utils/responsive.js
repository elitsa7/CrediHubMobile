import { useWindowDimensions } from "react-native";

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

export function useResponsive() {
  const { width, height, fontScale } = useWindowDimensions();

  const isSmallPhone = width < 375;
  const isTablet = width >= 600;
  const isLandscape = width > height;
  const isCompactHeight = height < 700;

  const scaleFactor = clamp(width / 390, 0.9, 1.15);

  const scale = (size) => size * scaleFactor;

  const moderateScale = (size, factor = 0.35) =>
    size + (scale(size) - size) * factor;

  const horizontalPadding = isSmallPhone ? 16 : isTablet ? 28 : 20;

  const contentMaxWidth = isTablet ? 900 : 560;

  const cardPadding = isSmallPhone ? 16 : 20;

  const sectionGap = isSmallPhone ? 16 : 20;

  return {
    width,
    height,
    fontScale,
    isSmallPhone,
    isTablet,
    isLandscape,
    isCompactHeight,
    scale,
    moderateScale,
    horizontalPadding,
    contentMaxWidth,
    cardPadding,
    sectionGap,
  };
}
