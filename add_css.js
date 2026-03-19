const fs = require('fs');

let css = fs.readFileSync('styles.css', 'utf8');

const marker = '.stats-grid {';
const idx = css.indexOf(marker);

if (idx === -1) {
    console.log('marker not found');
    process.exit(1);
}

const newCSS = `.about-highlights {
    list-style: none;
    padding: 0;
    margin: 1.5rem 0;
    display: grid;
    gap: 0.75rem;
}

.about-highlights li {
    position: relative;
    padding-left: 1.75rem;
    font-size: var(--text-md);
    color: var(--text-secondary);
    line-height: 1.7;
}

.about-highlights li::before {
    content: '\\2713';
    position: absolute;
    left: 0;
    color: var(--primary);
    font-weight: 700;
    font-size: 1.1em;
}

`;

css = css.substring(0, idx) + newCSS + css.substring(idx);
fs.writeFileSync('styles.css', css, 'utf8');
console.log('CSS added successfully!');
