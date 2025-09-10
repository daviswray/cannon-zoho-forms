# Form Widget Design Guidelines

## Design Approach
**Reference-Based Approach**: Drawing inspiration from modern productivity tools like Notion and Linear for clean, professional form design that prioritizes usability and efficiency.

## Core Design Elements

### A. Color Palette
**Light Mode:**
- Primary: 220 100% 50% (professional blue)
- Background: 0 0% 98% (near white)
- Surface: 0 0% 100% (pure white)
- Text: 220 20% 15% (dark blue-gray)
- Border: 220 15% 90% (light gray)

**Dark Mode:**
- Primary: 220 85% 65% (lighter blue)
- Background: 220 25% 8% (dark blue-gray)
- Surface: 220 20% 12% (elevated dark)
- Text: 220 15% 85% (light gray)
- Border: 220 15% 20% (dark border)

### B. Typography
- **Primary Font**: Inter via Google Fonts
- **Form Labels**: 14px, medium weight (500)
- **Input Text**: 16px, regular weight (400)
- **Helper Text**: 12px, regular weight (400)

### C. Layout System
**Spacing Units**: Tailwind units of 2, 4, 6, and 8
- Form container: p-6
- Field spacing: mb-4
- Input padding: p-3
- Label margin: mb-2

### D. Component Library

**Form Container:**
- Rounded corners (rounded-lg)
- Subtle shadow for depth
- Maximum width of 480px
- Responsive padding

**Input Fields:**
- Consistent height (h-12)
- Rounded borders (rounded-md)
- Focus states with primary color ring
- Smooth transitions (transition-colors)

**Dropdown Selects:**
- Custom styled select elements
- Chevron down icons
- Hover and focus states
- Generic options: "Option 1", "Option 2", etc.

**Radio Buttons (Buyer/Seller):**
- Horizontal layout
- Custom radio styling
- Clear visual selection states
- Adequate touch targets

**Submit Button:**
- Primary color background
- White text
- Hover state with slightly darker shade
- Full width on mobile, auto width on desktop

**Validation States:**
- Error states with red accent (0 65% 55%)
- Success states with green accent (142 70% 45%)
- Inline error messages below fields

### E. Interaction Design
- **No animations** to maintain professional focus
- Immediate visual feedback on form interactions
- Clear focus indicators for accessibility
- Smooth color transitions (150ms duration)

## Form Structure
1. **Agent Select** - Dropdown with placeholder "Select an agent"
2. **Client Name** - Text input with validation
3. **Buyer or Seller** - Radio button group
4. **Transaction Type** - Dropdown with generic options
5. **Listing Type** - Dropdown with generic options
6. **Submit Button** - Primary action button

## Responsive Behavior
- Single column layout on all screen sizes
- Maintain consistent spacing and proportions
- Touch-friendly targets (minimum 44px height)
- Proper form field focus management

This design prioritizes professional appearance, accessibility, and ease of use while maintaining flexibility for content customization.