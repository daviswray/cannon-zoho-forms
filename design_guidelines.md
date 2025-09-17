# Form Widget Design Guidelines

## Design Approach
**System-Based Approach**: Utility-focused design using Material Design principles for optimal form usability and data entry efficiency.

## Design Principles
- **Clarity First**: Clean, uncluttered interface prioritizing form completion
- **Progressive Disclosure**: Logical field grouping and flow
- **Accessibility**: High contrast, clear labels, keyboard navigation
- **Professional Aesthetic**: Business-appropriate styling for real estate transactions

## Core Design Elements

### Color Palette
**Light Mode:**
- Primary: 219 70% 50% (Professional blue)
- Surface: 0 0% 98% (Clean white background)
- Border: 220 13% 91% (Subtle gray borders)
- Text Primary: 220 9% 15% (Dark charcoal)
- Text Secondary: 220 9% 46% (Medium gray)

**Dark Mode:**
- Primary: 219 70% 60% (Lighter blue for contrast)
- Surface: 220 13% 8% (Dark background)
- Border: 220 13% 18% (Dark borders)
- Text Primary: 220 9% 95% (Light text)
- Text Secondary: 220 9% 65% (Medium light gray)

### Typography
- **Primary Font**: Inter (Google Fonts)
- **Label Text**: 14px, medium weight (500)
- **Input Text**: 16px, regular weight (400)
- **Helper Text**: 12px, regular weight (400)
- **Section Headers**: 18px, semibold (600)

### Layout System
- **Spacing Units**: Tailwind 2, 4, 6, 8 units consistently
- **Form Width**: Maximum 500px for optimal readability
- **Field Spacing**: 6 units between form groups
- **Internal Padding**: 4 units for inputs, 2 units for labels

### Component Library

**Form Container:**
- Rounded corners (8px radius)
- Subtle shadow for elevation
- White/dark background with border
- Responsive padding (6-8 units)

**Input Fields:**
- Consistent height (48px)
- Rounded borders (6px radius)
- Focus states with primary color ring
- Error states with red accent and icon

**Radio Button Groups:**
- Horizontal layout for Buyer/Seller and Listing Type
- Clear visual selection states
- Adequate touch targets (44px minimum)

**Dropdown Selects:**
- Chevron icons for visual consistency
- Searchable for Agent and Deal fields (if many options)
- Hover and focus states matching inputs

**Submit Section:**
- Primary action button (full width on mobile)
- Clear success/error messaging
- Loading states for form submission

## Form Organization
1. **Agent Information** (Agent Select)
2. **Client Details** (Client Name)
3. **Transaction Details** (Buyer/Seller, Transaction Type)
4. **Listing Information** (Listing Type, Deal)
5. **Submit Actions**

## Responsive Behavior
- **Mobile**: Single column, full-width inputs
- **Tablet/Desktop**: Maintain max-width container, two-column layout for radio groups
- Touch-friendly sizing on all devices

## Validation & Feedback
- Inline validation with clear error messages
- Success indicators for completed sections
- Required field indicators (asterisks or visual cues)
- Form-level validation summary

This design creates a professional, efficient form experience optimized for real estate transaction data entry while maintaining excellent usability across devices.