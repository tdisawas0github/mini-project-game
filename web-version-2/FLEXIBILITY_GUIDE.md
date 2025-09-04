# Flexible UI Components Guide

This guide demonstrates the enhanced responsive capabilities added to web-version-2, making it much more flexible for different screen sizes and layouts.

## Overview

All UI components now support:
- **Responsive Props**: Values that change based on screen size
- **Flexible Spacing**: Consistent spacing system with responsive support
- **Modern Layout**: Enhanced Flex and new Grid components
- **Breakpoint Hooks**: JavaScript-based responsive utilities

## Breakpoints

The theme system now includes predefined breakpoints:

```typescript
breakpoints: {
  xs: 480,   // Mobile
  sm: 768,   // Tablet
  md: 1024,  // Desktop
  lg: 1280,  // Large Desktop
  xl: 1536   // Extra Large
}
```

## Responsive Values

Any prop marked as `ResponsiveValue<T>` can accept either:
- A single value: `"16px"` or `2`
- An object with breakpoint-specific values: `{ xs: "8px", md: "16px", lg: "24px" }`

## Enhanced Components

### Container Component

```tsx
import { Container } from './components/ui';

// Responsive padding and width
<Container 
  padding={{ xs: 'sm', md: 'lg' }}
  width={{ xs: '100%', md: '80%', lg: '1200px' }}
  maxWidth={{ xs: 'none', md: '90vw' }}
>
  Content
</Container>
```

### Surface Component

```tsx
import { Surface } from './components/ui';

// Responsive surface with flexible sizing
<Surface 
  padding={{ xs: 'md', lg: 'xl' }}
  maxWidth={{ xs: '100%', md: '600px', lg: '800px' }}
  margin={{ xs: 'sm', md: 'lg' }}
>
  Surface content
</Surface>
```

### Enhanced Flex Component

```tsx
import { Flex } from './components/ui';

// Responsive direction and layout
<Flex 
  direction={{ xs: 'column', md: 'row' }}
  gap={{ xs: 'sm', md: 'lg' }}
  align={{ xs: 'center', md: 'flex-start' }}
  justify={{ xs: 'center', md: 'space-between' }}
  wrap={{ xs: 'wrap', lg: 'nowrap' }}
  padding={{ xs: 'sm', md: 'lg' }}
>
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</Flex>
```

### New Grid Component

```tsx
import { Grid } from './components/ui';

// Responsive grid layout
<Grid 
  columns={{ xs: 1, sm: 2, md: 3, lg: 4 }}
  gap={{ xs: 'sm', md: 'lg' }}
  padding={{ xs: 'md', lg: 'xl' }}
>
  <div>Grid Item 1</div>
  <div>Grid Item 2</div>
  <div>Grid Item 3</div>
  <div>Grid Item 4</div>
</Grid>

// Advanced grid with custom columns
<Grid 
  columns={{ 
    xs: '1fr', 
    md: 'repeat(2, 1fr)', 
    lg: '200px 1fr 100px' 
  }}
  rows={{ md: 'auto auto', lg: '200px 1fr' }}
  gap="lg"
>
  <div>Header</div>
  <div>Content</div>
  <div>Sidebar</div>
</Grid>
```

### Enhanced Button Component

```tsx
import { Button } from './components/ui';

// Responsive button sizing
<Button 
  size={{ xs: 'sm', md: 'md', lg: 'lg' }}
  fullWidth={{ xs: true, md: false }}
  margin={{ xs: 'sm', md: 'lg' }}
  variant="primary"
>
  Responsive Button
</Button>
```

### Enhanced Typography Component

```tsx
import { Typography } from './components/ui';

// Responsive typography
<Typography 
  variant={{ xs: 'body', md: 'h3', lg: 'h2' }}
  fontSize={{ xs: '14px', md: '16px', lg: '20px' }}
  textAlign={{ xs: 'center', md: 'left' }}
  fontWeight={{ xs: '400', md: '500' }}
  lineHeight={{ xs: '1.4', md: '1.6' }}
>
  Responsive text that adapts to screen size
</Typography>
```

## Responsive Hooks

### useBreakpoint

```tsx
import { useBreakpoint } from './hooks/useBreakpoint';

function MyComponent() {
  const breakpoint = useBreakpoint(); // 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  
  return (
    <div>
      Current breakpoint: {breakpoint}
      {breakpoint === 'xs' && <MobileLayout />}
      {['md', 'lg', 'xl'].includes(breakpoint) && <DesktopLayout />}
    </div>
  );
}
```

### useMediaQuery

```tsx
import { useMediaQuery } from './hooks/useBreakpoint';

function ResponsiveComponent() {
  const isMobile = useMediaQuery('(max-width: 767px)');
  const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 1023px)');
  
  return (
    <div>
      {isMobile && <span>Mobile View</span>}
      {isTablet && <span>Tablet View</span>}
    </div>
  );
}
```

### useResponsiveValue

```tsx
import { useResponsiveValue } from './hooks/useBreakpoint';

function FlexibleComponent() {
  const columns = useResponsiveValue(
    { xs: 1, sm: 2, md: 3, lg: 4 }, 
    2 // default value
  );
  
  return <div>Showing {columns} columns</div>;
}
```

### Convenience Hooks

```tsx
import { 
  useIsMobile, 
  useIsTablet, 
  useIsDesktop,
  useIsSm,
  useIsMd,
  useIsLg,
  useIsXl 
} from './utils';

function MyComponent() {
  const isMobile = useIsMobile();    // <= 767px
  const isTablet = useIsTablet();    // 768px - 1023px
  const isDesktop = useIsDesktop();  // >= 1024px
  
  return (
    <div>
      {isMobile && <MobileHeader />}
      {isTablet && <TabletHeader />}
      {isDesktop && <DesktopHeader />}
    </div>
  );
}
```

## Responsive Spacing

All components support responsive spacing props:

```tsx
// Responsive padding
<Surface 
  padding={{ xs: 'xs', sm: 'sm', md: 'md', lg: 'lg', xl: 'xl' }}
  paddingX={{ xs: 'sm', md: 'lg' }}  // horizontal padding
  paddingY={{ xs: 'xs', md: 'md' }}  // vertical padding
/>

// Responsive margin
<Button 
  margin={{ xs: 'sm', md: 'lg' }}
  marginX="md"
  marginY={{ xs: 'xs', lg: 'sm' }}
/>
```

## Responsive Sizing

Components support responsive width, height, and constraints:

```tsx
<Container
  width={{ xs: '100%', md: '80%', lg: '1200px' }}
  maxWidth={{ xs: 'none', md: '90vw' }}
  minWidth={{ md: '600px' }}
  height={{ xs: 'auto', md: '100vh' }}
  maxHeight="90vh"
  minHeight={{ xs: '300px', md: '400px' }}
/>
```

## Advanced Examples

### Responsive Dashboard Layout

```tsx
function Dashboard() {
  return (
    <Container padding={{ xs: 'sm', md: 'lg' }}>
      <Grid 
        columns={{ xs: 1, lg: '250px 1fr' }}
        gap={{ xs: 'md', lg: 'lg' }}
        minHeight="100vh"
      >
        {/* Sidebar - full width on mobile, fixed width on desktop */}
        <Surface 
          padding={{ xs: 'md', lg: 'lg' }}
          display={{ xs: 'none', lg: 'block' }}
        >
          <Typography variant={{ xs: 'h3', lg: 'h2' }}>Navigation</Typography>
          {/* Navigation items */}
        </Surface>
        
        {/* Main content area */}
        <Flex 
          direction="column" 
          gap={{ xs: 'md', lg: 'lg' }}
          padding={{ xs: 'sm', md: 'md' }}
        >
          <Typography 
            variant={{ xs: 'h2', md: 'h1' }}
            textAlign={{ xs: 'center', md: 'left' }}
          >
            Dashboard
          </Typography>
          
          {/* Content grid */}
          <Grid 
            columns={{ xs: 1, sm: 2, lg: 3 }}
            gap={{ xs: 'sm', md: 'md', lg: 'lg' }}
          >
            <Surface padding={{ xs: 'sm', md: 'md' }}>
              <Typography variant="h3">Card 1</Typography>
            </Surface>
            <Surface padding={{ xs: 'sm', md: 'md' }}>
              <Typography variant="h3">Card 2</Typography>
            </Surface>
            <Surface padding={{ xs: 'sm', md: 'md' }}>
              <Typography variant="h3">Card 3</Typography>
            </Surface>
          </Grid>
        </Flex>
      </Grid>
    </Container>
  );
}
```

### Responsive Form Layout

```tsx
function ContactForm() {
  return (
    <Surface 
      maxWidth={{ xs: '100%', md: '600px' }}
      margin={{ xs: 'sm', md: 'auto' }}
      padding={{ xs: 'md', md: 'lg' }}
    >
      <Typography 
        variant={{ xs: 'h2', md: 'h1' }}
        textAlign="center"
        marginBottom={{ xs: 'md', md: 'lg' }}
      >
        Contact Us
      </Typography>
      
      <Grid 
        columns={{ xs: 1, sm: 2 }}
        gap={{ xs: 'sm', md: 'md' }}
      >
        <input placeholder="First Name" />
        <input placeholder="Last Name" />
        <input placeholder="Email" style={{ gridColumn: { sm: 'span 2' } }} />
        <textarea 
          placeholder="Message" 
          style={{ gridColumn: { sm: 'span 2' } }} 
        />
        
        <Button 
          variant="primary"
          size={{ xs: 'md', md: 'lg' }}
          fullWidth={{ xs: true, sm: false }}
          style={{ gridColumn: { sm: 'span 2' } }}
        >
          Send Message
        </Button>
      </Grid>
    </Surface>
  );
}
```

This flexible system allows for:
- **Responsive Design**: Adapts to any screen size
- **Consistent Spacing**: Uses theme-based spacing system
- **Type Safety**: Full TypeScript support for all responsive values
- **Performance**: Optimized hooks with minimal re-renders
- **Accessibility**: Maintains semantic HTML structure
- **Maintainability**: Clean, predictable API

The enhanced system makes web-version-2 significantly more flexible and suitable for modern responsive web applications.