const fs = require('fs');
const path = 'index.html';

let html = fs.readFileSync(path, 'utf8');

// Find the about text div and replace its content
const oldStart = '<div class="reveal delay-100">';
const oldEnd = '</div>';

// Find the specific about-text div (the one containing "AI/ML Engineer and graduate student")
const searchText = "AI/ML Engineer and graduate student";
const idx = html.indexOf(searchText);
if (idx === -1) {
    console.log("Could not find the about text section");
    process.exit(1);
}

// Find the enclosing div start (go backwards from the found text)
let divStart = html.lastIndexOf('<div class="reveal delay-100">', idx);
if (divStart === -1) {
    console.log("Could not find the enclosing div");
    process.exit(1);
}

// Find the closing </div> for this div (need to count nested divs)
let depth = 0;
let i = divStart;
let divEnd = -1;
while (i < html.length) {
    if (html.substr(i, 4) === '<div') {
        depth++;
    } else if (html.substr(i, 6) === '</div>') {
        depth--;
        if (depth === 0) {
            divEnd = i + 6;
            break;
        }
    }
    i++;
}

if (divEnd === -1) {
    console.log("Could not find closing div");
    process.exit(1);
}

const oldContent = html.substring(divStart, divEnd);
console.log("Found old content length:", oldContent.length);

const newContent = `<div class="reveal delay-100">
                    <p class="about-text">
                        I build AI systems that don\u2019t just demo well \u2014 they ship, scale, and solve real business
                        problems. I'm an AI/ML engineer focused on turning complex data into intelligent products,
                        from production-grade LLM systems to end-to-end machine learning pipelines. If it involves
                        models, infrastructure, and measurable impact, I'm in.
                    </p>
                    <p class="about-text">
                        Recently graduated with M.S. in Artificial Intelligence at the University at Buffalo, I've
                        worked across data science, ML engineering, and AI product development roles to design
                        systems that move the needle. As a Data Scientist at Genpact, I built large-scale forecasting
                        models for 6K+ SKUs, achieving 86%+ accuracy and enabling better pricing decisions. I also
                        developed \u201CData Structurizer,\u201D an AI-powered document intelligence solution that reduced
                        processing costs by 15% using OCR and LLM pipelines. More recently, I've been building
                        production-ready RAG systems using Llama models, vector databases, and scalable inference
                        stacks, focusing on latency, reliability, and real-world performance. My work lives at the
                        intersection of ML, MLOps, and product thinking: not just training models, but deploying
                        systems that create value.
                    </p>
                    <ul class="about-highlights">
                        <li>Build and deploy LLM-powered RAG systems with vector databases and scalable APIs</li>
                        <li>Design end-to-end ML pipelines (data ingestion \u2192 training \u2192 monitoring \u2192 iteration)</li>
                        <li>Optimize models for production: latency reduction, cost efficiency, drift monitoring</li>
                        <li>Experienced across Python, PyTorch, PySpark, SQL, LangChain, Azure/GCP, and MLflow</li>
                        <li>IEEE-published researcher in computer vision (Person Re-identification)</li>
                    </ul>
                    <p class="about-text">
                        I also write about AI engineering, real-world ML systems, and the lessons learned between
                        notebook experiments and production reality. If you're building something ambitious or
                        thinking deeply about applied AI, let's connect.
                    </p>
                </div>`;

html = html.substring(0, divStart) + newContent + html.substring(divEnd);
fs.writeFileSync(path, html, 'utf8');
console.log("Successfully replaced about section!");
