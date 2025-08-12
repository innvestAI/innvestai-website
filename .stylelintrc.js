module.exports = {
  extends: ['stylelint-config-standard'],
  rules: {
    // Basic formatting
    'indent': 2,
    'quotes': 'single',
    'no-duplicate-selectors': true,
    
    // Colors
    'color-hex-length': 'short',
    'color-named': 'never',
    'color-function-notation': 'modern',
    'alpha-value-notation': 'percentage',
    
    // Spacing and layout
    'rule-empty-line-before': 'always-multi-line',
    'declaration-block-no-redundant-longhand-properties': true,
    
    // Fonts
    'font-family-name-quotes': 'always-unless-keyword',
    'font-weight-notation': 'numeric',
    
    // Keyframes
    'keyframes-name-pattern': 'kebab-case',
    
    // Media queries
    'media-feature-range-notation': 'context',
    
    // Selectors
    'no-descending-specificity': true,
    
    // Disable some strict rules for now
    'selector-class-pattern': null,
    'selector-id-pattern': null
  }
};
